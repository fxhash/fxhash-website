import { Editor, Transforms } from 'slate';
import { AutoFormatChangeType, ChangeData, AutoFormatChange } from './index';
import { getRangeFromBlockStartToCursor, getTextFromBlockStartToCursor } from '../utils';
import { BlockDefinitions, EArticleBlocks } from '../Elements/Blocks';
import { escapeRegExp } from "../../../../utils/regex";
export class BlockTypeChange implements AutoFormatChange {
  shortcut: string | string[]
  type: AutoFormatChangeType
  data: ChangeData
  trigger:string
  constructor(shortcut:string | string[], data: ChangeData) {
    this.shortcut = shortcut
    this.data = data
    this.type = 'BlockTypeChange'
    this.trigger = ' ';
  }

  apply = (editor: Editor, text: string): boolean => {
    const isTrigger = text === this.trigger;
    const textBeforeCursor = isTrigger ? getTextFromBlockStartToCursor(editor) : text;
    const testValues = typeof this.shortcut === 'string' ? [this.shortcut] : this.shortcut;
    const shortcutMatch = testValues.find((shortcut) => `${textBeforeCursor} `.startsWith(`${shortcut} `))
    if (isTrigger && shortcutMatch) {
      Transforms.delete(editor, {
	at: getRangeFromBlockStartToCursor(editor),
      })
      Transforms.setNodes(
	editor,
	{ ...this.data },
      )
      return true;
    } else {
      const matchLink = new RegExp(`^(${testValues.map(testValue => escapeRegExp(testValue)).join('|')})\\s(?<text>.*)`, 'gm');
      const matches = matchLink.exec(textBeforeCursor);
      if (!matches) return false;
      const { type } = this.data;
      const matchedText = matches.groups?.text;
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
