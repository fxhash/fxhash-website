import { Range, Point,  Node,  Editor, Transforms, Ancestor, NodeEntry } from 'slate'; 
import { AutoFormatChangeType, ChangeData, AutoFormatChange } from './index'; 

function getRangeBeforeCursor(editor: Editor): Range {
  const { anchor } = editor.selection as Range
  const block = Editor.above(editor, {
    match: n => Editor.isBlock(editor, n),
  })
  const path = block ? block[1] : []
  const start = Editor.start(editor, path)
  const range = { anchor, focus: start }
  return range;
}

export class BlockTypeChange implements AutoFormatChange {
  shortcut: string 
  type: AutoFormatChangeType
  data: ChangeData
  constructor(shortcut:string, data: ChangeData) {
    this.shortcut = shortcut
    this.data = data
    this.type = 'BlockTypeChange'
  }

  apply = (editor: Editor): boolean => {
    Transforms.delete(editor, {
      at: getRangeBeforeCursor(editor),
    })
    Transforms.setNodes(
      editor,
      { ...this.data },
    )
    return true;
  }
}
