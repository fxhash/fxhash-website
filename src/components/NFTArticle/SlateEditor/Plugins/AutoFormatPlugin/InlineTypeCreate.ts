import { Editor, Point, Range, Transforms } from 'slate';
import { AutoFormatChangeType, ChangeData, AutoFormatChange } from './index';
import { getRangeFromBlockStartToCursor, getTextFromBlockStartToCursor } from '../../utils';

export class InlineTypeCreate implements AutoFormatChange {
  shortcut: string | string[]
  type: AutoFormatChangeType
  data: ChangeData
  constructor(shortcut:string | string[], data: ChangeData) {
    this.shortcut = shortcut
    this.data = data
    this.type = 'InlineTypeCreate'
  }

  apply = (editor: Editor, text?: string): boolean => {
    const textBeforeCursor = `${getTextFromBlockStartToCursor(editor)}${text}` ;
    const testValues = typeof this.shortcut === 'string' ? [this.shortcut] : this.shortcut;
    const shortcutMatch = testValues.find((shortcut) => textBeforeCursor.endsWith(` ${shortcut}`))
    if (!shortcutMatch) return false;

    if (shortcutMatch.length > 1) {
      const [start] = Range.edges(editor.selection as Range);
      const charBefore = Editor.before(editor, start, {
        unit: 'character',
        distance: shortcutMatch.length,
      }) as Point;
      Transforms.delete(editor, {
        at: {
          anchor: charBefore,
          focus: start
        }
      })
    }
    Transforms.insertNodes(
      editor,
      {
        ...this.data,
        children: [{text: ''}],
      }
    )
    return true;
  }
}
