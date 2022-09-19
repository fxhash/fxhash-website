import { Editor, Node, NodeEntry, Path, Range, Transforms } from "slate"
import { AutoFormatChange, AutoFormatChangeType, ChangeData } from "./index"
import { getTextFromBlockStartToCursor } from "../../utils"
import { escapeRegExp } from "../../../../../utils/regex"

function getSelectionAccrossNodes(
  editor: Editor,
  startOffset: number,
  endOffset: number,
  shortcut: string
): Range {
  const block = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n),
  }) as NodeEntry
  const node = block[0] as Node
  const { selection } = editor
  const { anchor, focus } = node.children.reduce(
    (acc: { [key: string]: any }, node: Node, index: number) => {
      const { anchor } = selection as Range
      acc.sum += node.text?.length || 0
      if (
        acc.sum > startOffset &&
        !acc.anchor &&
        node.text?.indexOf(shortcut) > -1
      ) {
        acc.anchor = {
          path: [anchor.path[0], index],
          offset: node.text?.indexOf(shortcut),
        }
      }
      if (
        acc.sum >= endOffset &&
        !acc.focus &&
        node.text?.indexOf(shortcut) > -1
      ) {
        acc.focus = {
          path: [anchor.path[0], index],
          offset: node.text?.lastIndexOf(shortcut) + shortcut.length,
        }
      }
      return acc
    },
    { sum: 0 }
  )
  return { anchor, focus }
}

export class InlineTypeChange implements AutoFormatChange {
  shortcut: string | string[]
  type: AutoFormatChangeType
  data: ChangeData

  constructor(shortcut: string | string[], data: ChangeData) {
    this.shortcut = shortcut
    this.data = data
    this.type = "InlineTypeChange"
  }

  apply = (editor: Editor): boolean => {
    const testValues =
      typeof this.shortcut === "string" ? [this.shortcut] : this.shortcut
    const textBeforeCursor = `${getTextFromBlockStartToCursor(editor)} `
    const shortcutMatch = testValues.find((shortcut) =>
      textBeforeCursor.endsWith(`${shortcut} `)
    )
    if (!shortcutMatch) return false

    // retreive the matches based on usual markdown pattern, e.g.
    // __bold__, _italic_, etc.
    const escapedShortcut = escapeRegExp(shortcutMatch)
    const matcher = RegExp(
      `(?<!${escapedShortcut})${escapedShortcut}(?!${escapedShortcut}).+?${escapedShortcut}`,
      "g"
    )
    const matches = textBeforeCursor.match(matcher)
    if (!matches) return false
    Transforms.insertText(editor, " ")

    // We need to get a slate Point for the matched string inside the
    // editor state. Since the text can be split up into multiple nodes
    // and the selection can go across them, we need to retrieve the
    // selection across multiple nodes
    const matchStartIndex = textBeforeCursor.indexOf(matches[0])
    const matchEndIndex = matchStartIndex + matches[0].length
    const inlineRange = getSelectionAccrossNodes(
      editor,
      matchStartIndex,
      matchEndIndex,
      shortcutMatch
    )
    Transforms.select(editor, inlineRange)
    // For each value in data add a mark to the node
    Object.keys(this.data).forEach((key: string) => {
      const value = this.data[key]
      editor.addMark(key, value)
    })
    Transforms.collapse(editor, { edge: "anchor" })
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
        offset: selectionBeforeMatch.anchor.offset + shortcutMatch.length,
      },
    }
    Transforms.delete(editor, {
      at: rangeBefore,
    })
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
        offset: selectionAfterMatch.anchor.offset + shortcutMatch.length,
      },
    }
    Transforms.delete(editor, {
      at: rangeAfter,
    })
    const currentPath = selectionAfterMatch.anchor.path
    const nextPath = Path.next(currentPath)
    Transforms.select(editor, {
      anchor: {
        path: nextPath,
        offset: 1,
      },
      focus: {
        path: nextPath,
        offset: 1,
      },
    })
    return true
  }
}
