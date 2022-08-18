import { Range, Point,  Node,  Editor, Transforms, Ancestor, NodeEntry } from 'slate';
import { AutoFormatChangeType, ChangeData, AutoFormatChange } from './index';
import { getTextFromBlockStartToCursor } from '../utils';
import { getSlateEditorStateFromMarkdownSync } from '../../processor/getSlateEditorStateFromMarkdown';


export class FigureAutoFormat implements AutoFormatChange {
  shortcut: string
  type: AutoFormatChangeType
  data?: ChangeData
  trigger: string

  constructor(data?: ChangeData) {
    this.shortcut = 'figure'
    if (data) this.data = data
    this.type = 'FigureAutoFormat'
    this.trigger = ' '
  }

  getMarkdownFromCurrentCursorPosition(editor: Editor) {
    const textBeforeCursor = getTextFromBlockStartToCursor(editor);
    const matchLink = new RegExp('!\\[(?<text>.+?)\\]\\((?<attributes>.+?)\\)', 'gm');
    const matches = matchLink.exec(textBeforeCursor);
    return matches?.[0];
  }

  apply(editor: Editor, text: string): boolean {
    const isTrigger = text === this.trigger;
    const markdownString = isTrigger ? this.getMarkdownFromCurrentCursorPosition(editor) : text;
    if (!markdownString) return false;
    try {
      const parsed = getSlateEditorStateFromMarkdownSync(markdownString)
      if (!parsed) return false;
      const {editorState: [figureNode]} = parsed;
      if (!figureNode || figureNode.type !== this.shortcut) return false;
      const [start] = Range.edges(editor.selection as Range);
      const charBefore = Editor.before(editor, start, {
	unit: 'character',
	distance: markdownString.length,
      }) as Point;
      if(isTrigger) {
	Transforms.delete(editor, {
	  at: {
	    anchor: charBefore,
	    focus: start
	  }
	})
      }
      Transforms.insertNodes(
	editor,
	[figureNode]
      )
      return true   
    } catch {
      return false;
    }
  }
}
