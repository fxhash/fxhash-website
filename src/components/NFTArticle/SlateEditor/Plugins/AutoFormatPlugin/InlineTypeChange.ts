import { Editor, Node, NodeEntry, Path, Range, Transforms, Location } from 'slate';
import { AutoFormatChange, AutoFormatChangeType, ChangeData } from './index';
import { getTextFromBlockStartToCursor, lookupElementAtSelection } from '../../utils';
import { escapeRegExp } from "../../../../../utils/regex";
import { getSlateEditorStateFromMarkdownSync } from '../../../processor/getSlateEditorStateFromMarkdown';
import { BlockDefinitions, EArticleBlocks } from '../../Blocks';

function getSelectionAccrossNodes(
  editor: Editor,
  startOffset: number,
  endOffset: number,
  shortcut: string
): Range {
  const block = Editor.above(editor, {
    match: n => Editor.isBlock(editor, n),
  }) as NodeEntry;
  const node = block[0] as Node;
  const { selection } = editor
  const { anchor, focus } = node.children.reduce((acc: { [key: string]: any }, node: Node, index: number) => {
    const { anchor } = selection as Range
    acc.sum += node.text?.length || 0;
    if (acc.sum > startOffset && !acc.anchor && node.text?.indexOf(shortcut) > -1) {
      acc.anchor = {
        path: [anchor.path[0], index],
        offset: node.text?.indexOf(shortcut)
      };
    }
    if (acc.sum >= endOffset && !acc.focus && node.text?.indexOf(shortcut) > -1) {
      acc.focus = {
        path: [anchor.path[0], index],
        offset: node.text?.lastIndexOf(shortcut) + shortcut.length
      };
    }
    return acc;
  }, { sum: 0 })
  return { anchor, focus };
}

export class InlineTypeChanges implements AutoFormatChange {
  shortcut: string | string[]
  type: AutoFormatChangeType
  data: ChangeData
  formats: [ChangeData, string | string[]][]

  constructor(formats: [ChangeData, string | string[]][]) {
    this.type = 'InlineTypeChanges'
    this.formats = formats;
    this.shortcut = formats.map(([,shortcut]) => shortcut ).flat()
    this.data = formats.reduce((acc:ChangeData, [data, shortcut]: [ChangeData, string | string[]]) => {
      if (Array.isArray(shortcut)) {
	shortcut.forEach((s: string) => {
	  acc[s] = data;
	})
      } else {
	acc[shortcut] = data;
      }
      return acc; 
    }, {})
  }

  apply = (
    editor: Editor,
    text: string
  ): boolean => {
    // We use the inline menu configuration to check if the current element actually allows
    // inline styles
    const [elementUnderCursor] = lookupElementAtSelection(editor, editor.selection as Location) || []
    const { inlineMenu } = BlockDefinitions[elementUnderCursor?.type as any as EArticleBlocks] || {};
    let hideFloatingInlineMenu = inlineMenu === null;
    if (hideFloatingInlineMenu) return false;
    const testValues = typeof this.shortcut === 'string' ? [this.shortcut] : this.shortcut
    const textBeforeCursor = getTextFromBlockStartToCursor(editor)
    const isPasted = text.length > 1;
    const shortcutMatch = testValues.find((shortcut) => textBeforeCursor.endsWith(shortcut))
    if (shortcutMatch) {
      const changeData = this.data[shortcutMatch] as ChangeData;
      const [, shortcut] = this.formats.find(([data]) => data === changeData) || [];
      if (!shortcut) return false;
      const formatAliases = typeof shortcut === 'string' ? [shortcut] : shortcut;
      // retreive the matches based on usual markdown pattern, e.g.
      // __bold__, _italic_, etc.
      const escapedShortcuts = `(${formatAliases.map((shortcut: string) => escapeRegExp(shortcut)).join('|')})`
      const matcher = RegExp(`(?<!${escapedShortcuts})${escapedShortcuts}(?!${escapedShortcuts}).+?${escapedShortcuts}`, 'g')
      const matches = textBeforeCursor.match(matcher);
      if (!matches) return false;
      const match = matches[0];
      if (!match.startsWith(shortcutMatch) || !match.endsWith(shortcutMatch)) return false
      // We need to get a slate Point for the matched string inside the
      // editor state. Since the text can be split up into multiple nodes
      // and the selection can go across them, we need to retrieve the
      // selection across multiple nodes
      const matchStartIndex = textBeforeCursor.indexOf(match)
      const matchEndIndex = matchStartIndex + match.length;
      const inlineRange = getSelectionAccrossNodes(
	editor,
	matchStartIndex,
	matchEndIndex,
	shortcutMatch
      )
      Transforms.select(editor, inlineRange)
      // For each value in data add a mark to the node
      Object.keys(changeData).forEach((key: string) => {
	const value = changeData[key];
	editor.addMark(key, value);
      })
      Transforms.collapse(editor, { edge: 'anchor' })
      // Now lets cleanup the md shortcuts from the text.
      // Setting the marks on text nodes can result in a new structure
      // because elements might be split up to apply the styles.
      // Therefore we retrieve the updated selection of the matched string.
      const selectionBeforeMatch = getSelectionAccrossNodes(
	editor,
	matchStartIndex,
	matchEndIndex,
	shortcutMatch
      )
      // Create a range that matches the md shortcut
      // before the search string (anchor)
      const rangeBefore = {
	anchor: selectionBeforeMatch.anchor,
	focus: {
	  ...selectionBeforeMatch.anchor,
	  offset: selectionBeforeMatch.anchor.offset + shortcutMatch.length
	}
      }
      Transforms.delete(
	editor,
	{
	  at: rangeBefore
	}
      )
      const selectionAfterMatch = getSelectionAccrossNodes(
	editor,
	matchStartIndex,
	matchEndIndex,
	shortcutMatch
      )
      // Create a range that matches the md shortcut
      // after the search string (focus)
      const rangeAfter = {
	anchor: selectionAfterMatch.anchor,
	focus: {
	  ...selectionAfterMatch.anchor,
	  offset: selectionAfterMatch.anchor.offset + shortcutMatch.length
	},
      }
      Transforms.delete(
	editor,
	{
	  at: rangeAfter,
	}
      )
      Transforms.move(editor, {
	distance: selectionAfterMatch.anchor.offset, 
	unit: 'character'
      })

      Transforms.insertText(editor, text)
      const selection = editor.selection as Range;

      Transforms.select(editor, {
	anchor: {...selection.anchor, offset: selection.anchor.offset - text.length},
	focus: selection.focus,
      })

      Object.keys(changeData).forEach((key: string) => {
	editor.removeMark(key)
      })
      Transforms.collapse(editor, {edge: 'focus'})
      return true;
    } else if(isPasted) {
      try {
	const escapedShortcuts = `(${(this.shortcut as string[]).map((shortcut: string) => escapeRegExp(shortcut)).join('|')})`
	const matcher = RegExp(`(?<!${escapedShortcuts})${escapedShortcuts}(?!${escapedShortcuts}).+?${escapedShortcuts}`, 'g')
	const matches = matcher.exec(text)
	if (!matches) return false
	const parsed = getSlateEditorStateFromMarkdownSync(text)
	if (!parsed) return false
	Transforms.insertFragment(editor, parsed.editorState[0].children)
	return true;
      } catch {
	return false
      }
    }
    return false;
  }
}

