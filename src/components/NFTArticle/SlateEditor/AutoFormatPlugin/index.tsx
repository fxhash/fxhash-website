import { Range, Editor  } from 'slate'; 
import { BlockTypeChange } from './BlockTypeChange'
import { InlineTypeChange } from './InlineTypeChange'
import { CustomDirectiveChange } from './CustomDirectiveChange'
import { getTextFromBlockStartToCursor } from '../utils'
export type AutoFormatChangeType = "BlockTypeChange" | "InlineTypeChange" | "CustomDirectiveChange";
export type ChangeData = {[key: string]: number | string | boolean}

export type AutoFormatChange = {
  shortcut: string
  type: AutoFormatChangeType
  data?: ChangeData
}

function createChangeTypeHeading():AutoFormatChange[] {
  const changes = [];
  for(let i = 1; i < 6; i++) {
    changes.push(new BlockTypeChange(
      Array(i).fill('#').join(''), 
      {
	type: 'heading', 
	depth: i,
      }
    ));
  }
  return changes;
}

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

const config: AutoFormatChange[] = [ 
  ...createChangeTypeHeading(),
  new BlockTypeChange('p',   {type: 'paragraph',} ), 
  new InlineTypeChange('__', {strong: true}), 
  new InlineTypeChange('_', {emphasis: true}), 
  new CustomDirectiveChange('tezos-storage'), 
]

export const withAutoFormat = (editor: Editor) => {
  const {insertText } = editor;
  editor.insertText = text => {
    const { selection } = editor;
    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const handled = config.some(change =>  {
	if(change.type === 'BlockTypeChange') {
	  return (change as BlockTypeChange).apply(editor)
	} else if (change.type === 'InlineTypeChange') {
	  return (change as InlineTypeChange).apply(editor)
	} else if(change.type === 'CustomDirectiveChange') {
	  return (change as CustomDirectiveChange).apply(editor)
	}
	return false;
      });
      if (handled) return true;
    }
    insertText(text)
  }

  return editor
}
