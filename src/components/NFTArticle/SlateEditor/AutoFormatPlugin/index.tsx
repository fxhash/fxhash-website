import { Range, Editor, Element, Node} from 'slate'; 
import { BlockTypeChange } from './BlockTypeChange'
import { InlineTypeChange } from './InlineTypeChange'
import { CustomDirectiveChange } from './CustomDirectiveChange'
import { LinkChange } from './LinkChange'
export type AutoFormatChangeType = "BlockTypeChange" | "InlineTypeChange" | "CustomDirectiveChange";
export type ChangeData = {[key: string]: number | string | boolean}

export type AutoFormatChange = {
  shortcut: string
  type: AutoFormatChangeType
  data?: ChangeData
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
  new InlineTypeChange('__', {strong: true}), 
  new InlineTypeChange('**', {strong: true}), 
  new InlineTypeChange('_', {emphasis: true}), 
  new InlineTypeChange('*', {emphasis: true}), 
  new InlineTypeChange('`', {inlineCode: true}), 
  new CustomDirectiveChange('tezos-storage'), 
  new CustomDirectiveChange('embed-media'), 
  new CustomDirectiveChange('link'),
  new LinkChange(), 
]

export const withAutoFormat = (editor: Editor) => {
  const { insertText } = editor;
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
        } else if(change.type === 'LinkChange') {
          return (change as LinkChange).apply(editor)
        }
        return false;
      });
      if (handled) return true;
    }
    insertText(text)
  }

  return editor
}
