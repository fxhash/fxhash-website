import { Range, Editor, Text, Transforms, Element, NodeEntry } from 'slate';

export function getRangeFromBlockStartToCursor(editor: Editor): Range {
  const { anchor } = editor.selection as Range;
  const block = Editor.above(editor, {
    match: n => Editor.isBlock(editor, n),
  })
  const path = block ? block[1] : []
  const start = Editor.start(editor, path)
  const range = { anchor, focus: start }
  return range;
}

export function getRangeFromCursorToBlockEnd(editor: Editor): Range {
  const { anchor } = editor.selection as Range;
  const block = Editor.above(editor, {
    match: n => Editor.isBlock(editor, n),
  })
  const path = block ? block[1] : []
  const end = Editor.end(editor, path)
  const range = { anchor, focus: end }
  return range;
}

export function getTextFromBlockStartToCursor(editor: Editor): string {
  const range = getRangeFromBlockStartToCursor(editor)
  return Editor.string(editor, range)
}
export function getTextFromCursorToBlockEnd(editor: Editor): string {
  const range = getRangeFromCursorToBlockEnd(editor)
  return Editor.string(editor, range)
}

export function isMarkActive(editor: Editor, format: string): boolean {
  const marks = Editor.marks(editor) as {[key: string]: boolean}
  return marks ? marks[format] === true : false
}

export function toggleMark(editor: Editor, format: string): void {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export function isFormatActive(editor: Editor, format: string):boolean {
  const [match] = Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all',
  })
  return !!match
}

export function toggleFormat(editor: Editor, format: string): void {
  const isActive = isFormatActive(editor, format)
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  )
}

export function lookupElementByType(editor:Editor, type: string): NodeEntry {
  const [element] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === type,
  })
  return element
}

