import { Range, Point,  Node,  Editor, Transforms, Ancestor, NodeEntry } from 'slate'; 
import { AutoFormatChangeType, ChangeData, AutoFormatChange } from './index'; 
import { getRangeFromBlockStartToCursor, getTextFromBlockStartToCursor } from '../utils';
import { BlockDefinitions, EArticleBlocks } from '../Elements/Blocks';
export class BlockTypeChange implements AutoFormatChange {
  shortcut: string 
  type: AutoFormatChangeType
  data: ChangeData
  trigger:string
  constructor(shortcut:string, data: ChangeData) {
    this.shortcut = shortcut
    this.data = data
    this.type = 'BlockTypeChange'
    this.trigger = ' ';
  }


  apply = (editor: Editor, text: string): boolean => {
    const isTrigger = text === this.trigger;
    const textBeforeCursor = isTrigger ? getTextFromBlockStartToCursor(editor) : text;
    if (isTrigger && textBeforeCursor === this.shortcut) {
      Transforms.delete(editor, {
	at: getRangeFromBlockStartToCursor(editor),
      })
      Transforms.setNodes(
	editor,
	{ ...this.data },
      )
      return true;
    } else {
      const matchLink = new RegExp(`^${this.shortcut}\\s(?<text>.*)`, 'gm');
      const matches = matchLink.exec(textBeforeCursor);
      if (!matches) return false;
      const { type } = this.data;
      const  matchedText = matches.groups?.text;
      if (!matchedText) return false;
      const blockDefinition = BlockDefinitions[type as EArticleBlocks];
      const element = blockDefinition?.instanciateElement?.({...this.data, text: matchedText})
      if(!element) return false; 
      Transforms.insertNodes(
	editor,
	element, 
      )
      return true;
    }
  }
}
