import { Range, Editor, Text, Transforms  } from 'slate'; 
import { FormattedText } from './index';

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

export function getTextFromBlockStartToCursor(editor: Editor): string {
  const range = getRangeFromBlockStartToCursor(editor)
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
