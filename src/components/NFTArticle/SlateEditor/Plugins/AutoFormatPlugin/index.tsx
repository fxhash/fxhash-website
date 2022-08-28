import { Range, Editor  } from 'slate';
import { BlockTypeChange } from './BlockTypeChange'
import { InlineTypeChanges } from './InlineTypeChange'
import { CustomDirectiveChange } from './CustomDirectiveChange'
import { LinkAndFigureAutoFormat } from './LinkAndFigureAutoFormat'

export type AutoFormatChangeType = "BlockTypeChange" | "InlineTypeChanges" | "CustomDirectiveChange" | "LinkAndFigureAutoFormat"
export type ChangeData = {[key: string]: number | string | boolean | ChangeData}

export type AutoFormatChange = {
  shortcut: string | string[]
  type: AutoFormatChangeType
  data?: ChangeData
  apply: (editor: Editor, text: string) => boolean,
}

function createChangeTypeHeading():AutoFormatChange[] {
  const changes = [];
  for (let i = 1; i <= 6; i++) {
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

const config: AutoFormatChange[] = [
  ...createChangeTypeHeading(),
  new BlockTypeChange('p',   {type: 'paragraph',} ), 
  new BlockTypeChange('>',   {type: 'blockquote',} ), 
  new BlockTypeChange(['---', '***', '___'], {type: 'thematicBreak'}),
  new BlockTypeChange(['-', '*'], {type: 'listItem'}),
  new InlineTypeChanges([ 
    [{strong: true}, ['__', '**']],
    [{emphasis: true}, ['_', '*']],
    [{inlineCode: true}, ['`']],
  ]),
  new CustomDirectiveChange('embed-media'), 
  new CustomDirectiveChange('tezos-storage-pointer'),
  new LinkAndFigureAutoFormat(), 
]

export const withAutoFormat = (editor: Editor) => {
  const { insertText } = editor;
  editor.insertText = text => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const handled = config.some(change =>  {
        const handler = ['BlockTypeChange', 'InlineTypeChanges', 'CustomDirectiveChange', 'LinkAndFigureAutoFormat'].indexOf(change.type) > -1 ?
	  change.apply(editor, text) : false
	if(handler) {
	  console.log(change.type)
	}
	return handler;
      });
      if (handled) return true;
    }
    insertText(text)
  }

  return editor
}
