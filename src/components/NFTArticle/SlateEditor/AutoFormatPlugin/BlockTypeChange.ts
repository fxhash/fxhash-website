import { Range, Point,  Node,  Editor, Transforms, Ancestor, NodeEntry } from 'slate'; 
import { AutoFormatChangeType, ChangeData, AutoFormatChange } from './index'; 
import { getRangeFromBlockStartToCursor, getTextFromBlockStartToCursor } from '../utils';

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
    const textBeforeCursor = `${getTextFromBlockStartToCursor(editor)} `;
    if (!textBeforeCursor.startsWith(`${this.shortcut} `)) return false;

    Transforms.delete(editor, {
      at: getRangeFromBlockStartToCursor(editor),
    })
    Transforms.setNodes(
      editor,
      { ...this.data },
    )
    return true;
  }
}
