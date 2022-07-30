import { Range, Point,  Node,  Editor, Transforms, Ancestor, NodeEntry } from 'slate';
import { AutoFormatChangeType, ChangeData, AutoFormatChange } from './index';
import { getTextFromBlockStartToCursor } from '../utils';
import { getSlateEditorStateFromMarkdownSync } from '../../processor/getSlateEditorStateFromMarkdown';

const LINK_MATCHER = new RegExp('((?<type>[.]*)s*\\[(?<text>.*)\\]s*[{(]*(?<attributes>.*)[)}]+)', 'gm');

export class LinkChange implements AutoFormatChange {
  shortcut: string
  type: AutoFormatChangeType
  data?: ChangeData

  constructor(data?: ChangeData) {
    this.shortcut = 'link'
    if (data) this.data = data
    this.type = 'LinkChange'
  }

  apply(editor: Editor): boolean {
    const textBeforeCursor = getTextFromBlockStartToCursor(editor);
    const matchDirective = LINK_MATCHER;
    const matches = matchDirective.exec(textBeforeCursor);
    console.log(matches)
    if (!matches) return false;
    try {
      const parsed = getSlateEditorStateFromMarkdownSync(matches[0])
      console.log(parsed)
      if (!parsed) return false;
      const {editorState: [parsedNode]} = parsed;
      const linkNode = parsedNode?.children?.[0];
      if (!linkNode || linkNode.type !== this.shortcut) return false;
      const [start] = Range.edges(editor.selection as Range);
      const charBefore = Editor.before(editor, start, {
	unit: 'character',
	distance: matches[0].length,
      }) as Point;
      Transforms.delete(editor, {
	at: {
	  anchor: charBefore,
	  focus: start
	}
      })
      Transforms.insertNodes(
	editor,
	linkNode
      )
      return true
    } catch {
      return false;
    }
  }
}
