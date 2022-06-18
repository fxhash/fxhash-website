import { Range, Point,  Node,  Editor, Transforms, Ancestor, NodeEntry } from 'slate'; 
import { AutoFormatChangeType, ChangeData, AutoFormatChange } from './index'; 
import { getTextFromBlockStartToCursor } from '../utils';

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
  const { anchor, focus } = node.children.reduce((acc: {[key: string]: any}, node: Node, index: number) => {
    const { anchor } = selection as Range
    acc.sum += node.text?.length || 0;
    if(acc.sum > startOffset && !acc.anchor && node.text?.indexOf(shortcut) > -1) {
      acc.anchor = {
	path: [anchor.path[0], index], 
	offset: node.text?.indexOf(shortcut)
      };
    }
    if(acc.sum >= endOffset && !acc.focus && node.text?.indexOf(shortcut) > -1) {
      acc.focus = {
	path: [anchor.path[0], index], 
	offset: node.text?.lastIndexOf(shortcut) + shortcut.length
      };
    }
    return acc;
  }, {sum: 0})
  return { anchor,  focus };
}

export class InlineTypeChange implements AutoFormatChange {
  shortcut: string
  type: AutoFormatChangeType
  data: ChangeData
  constructor(shortcut:string, data: ChangeData) {
    this.shortcut = shortcut
    this.data = data
    this.type = 'InlineTypeChange'
  }

   apply = (
    editor: Editor, 
   ): boolean => {
    const textBeforeCursor = getTextFromBlockStartToCursor(editor)
    const beforeTextWithSpace = `${textBeforeCursor} `
    if (!beforeTextWithSpace.endsWith(`${this.shortcut} `)) { return false }
    // retreive the matches based on usual markdown pattern, e.g.
    // __bold__, _italic_, etc.
    // (?<!__)__(?!__).+?__
    const matcher = RegExp(`(?<!${this.shortcut})${this.shortcut}(?!${this.shortcut}).+?${this.shortcut}`, 'g')
    const matches = textBeforeCursor.match(matcher);
    if (!matches) return false;
    // We need to get a slate Point for the matched string inside the 
    // editor state. Since the text can be split up into multiple nodes
    // and the selection can go across them, we need to retrieve the
    // selection across multiple nodes
    const matchStartIndex = textBeforeCursor.indexOf(matches[0])
    const matchEndIndex = matchStartIndex + matches[0].length;
    const inlineRange = getSelectionAccrossNodes(
      editor,
      matchStartIndex,
      matchEndIndex,
      this.shortcut
    )
    Transforms.select(editor, inlineRange)
    // For each value in data add a mark to the node
    Object.keys(this.data).forEach((key: string) => {
      const value = this.data[key];
      editor.addMark(key, value);
    })
    Transforms.collapse(editor, {edge: 'anchor'})
    // Now lets cleanup the md shortcuts from the text.
    // Setting the marks on text nodes can result in a new structure
    // because elements might be split up to apply the styles.
    // Therefore we retrieve the updated selection of the matched string. 
    const selectionBeforeMatch = getSelectionAccrossNodes(
      editor, 
      matchStartIndex, 
      matchEndIndex,
      this.shortcut
    )
    // Create a range that matches the md shortcut 
    // before the search string (anchor)
    const rangeBefore = {
      anchor: selectionBeforeMatch.anchor,
      focus: {
	...selectionBeforeMatch.anchor, 
	offset: selectionBeforeMatch.anchor.offset + this.shortcut.length
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
      this.shortcut
    )
    // Create a range that matches the md shortcut 
    // after the search string (focus) 
    const rangeAfter  = {
      anchor: selectionAfterMatch.anchor,
      focus: {
	...selectionAfterMatch.anchor, 
	offset: selectionAfterMatch.anchor.offset + this.shortcut.length
      },
    }
    Transforms.delete(
      editor, 
      {
	at: rangeAfter, 
      }
    )
    return true;
  }
}

