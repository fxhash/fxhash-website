import { Range, Editor  } from 'slate';
import { BlockTypeChange } from './BlockTypeChange'
import { InlineTypeChange } from './InlineTypeChange'
import { CustomDirectiveChange } from './CustomDirectiveChange'
export type AutoFormatChangeType = "BlockTypeChange" | "InlineTypeChange" | "CustomDirectiveChange" | "InlineTypeCreate";
export type ChangeData = {[key: string]: number | string | boolean}

export type AutoFormatChange = {
  shortcut: string | string[]
  type: AutoFormatChangeType
  data?: ChangeData
  apply: (editor: Editor, text?: string) => boolean,
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

const changeWithSpaceValidation: AutoFormatChange[] = [
  ...createChangeTypeHeading(),
  new BlockTypeChange('p',   {type: 'paragraph',} ),
  new InlineTypeChange(['__', '**'], {strong: true}),
  new InlineTypeChange(['_', '*'], {emphasis: true}),
  new BlockTypeChange(['---', '***', '___'], {type: 'thematicBreak'}),
  new CustomDirectiveChange('tezos-storage-pointer'),
]

export const withAutoFormat = (editor: Editor) => {
  const { insertText } = editor;
  editor.insertText = text => {
    const { selection } = editor;
    let handled = false;
    if (selection && Range.isCollapsed(selection)) {
      if (text === ' ') {
        handled = changeWithSpaceValidation.some(change => change.apply(editor));
      }
      if (handled) return true;
    }
    insertText(text)
  }

  return editor
}
