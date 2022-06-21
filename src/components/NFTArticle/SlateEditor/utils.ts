import { Range, Editor  } from 'slate'; 

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
