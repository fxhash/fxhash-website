import { Range, Editor  } from 'slate';
import { BlockTypeChange } from './BlockTypeChange'
import { InlineTypeChange } from './InlineTypeChange'
import { CustomDirectiveChange } from './CustomDirectiveChange'
export type AutoFormatChangeType = "BlockTypeChange" | "InlineTypeChange" | "CustomDirectiveChange";
export type ChangeData = {[key: string]: number | string | boolean}

export type AutoFormatChange = {
  shortcut: string | string[]
  type: AutoFormatChangeType
  data?: ChangeData
  apply: (editor: Editor) => boolean,
}

function createChangeTypeHeading():AutoFormatChange[] {
  const changes = [];
  for (let i = 1; i < 6; i++) {
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
  new InlineTypeChange(['__', '**'], {strong: true}),
  new InlineTypeChange(['_', '*'], {emphasis: true}),
  new BlockTypeChange(['---', '***', '___'], {type: 'thematicBreak'}),
  new CustomDirectiveChange('tezos-storage'),
]

export const withAutoFormat = (editor: Editor) => {
  const { insertText } = editor;
  editor.insertText = text => {
    const { selection } = editor;
    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const handled = config.some(change =>  {
        return ['BlockTypeChange', 'InlineTypeChange', 'CustomDirectiveChange'].indexOf(change.type) > -1 ?
          change.apply(editor) : false
      });
      if (handled) return true;
    }
    insertText(text)
  }

  return editor
}
