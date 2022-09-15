import { Range, Point,  Node,  Editor, Transforms, Ancestor, NodeEntry } from 'slate';
import { AutoFormatChangeType, ChangeData, AutoFormatChange } from './index';
import { getTextFromBlockStartToCursor } from '../../utils';
import { getSlateEditorStateFromMarkdownSync } from '../../../processor/getSlateEditorStateFromMarkdown';

function parseAttributes(attributes:string|undefined): {[key: string]: any} {
  const classNames = []
  const parsed: {[key: string]: any} = {}
  if (!attributes) return parsed;
  const entries = decodeURI(attributes).split(' ');
  entries.forEach(entry => {
    if(entry.startsWith('#')) {
      parsed.id = entry.substring(1)
      return;
    } else if(entry.startsWith('.')) {
      classNames.push(entry.substring(1))
      return;
    } else {
      const keyValueMatcher = new RegExp('"*(?<key>.*)"*="*(?<value>[^"]*)"*', 'mg')
      const keyValueMatches = keyValueMatcher.exec(entry)
      if(keyValueMatches) {
	const key = keyValueMatches.groups?.['key']
	const value = keyValueMatches.groups?.['value']
	if(!parsed.attributes)  {
	  parsed.attributes = {} as {[key:string]: any}
	}
	if(key && value) {
	  parsed.attributes[key] = value
	}
	return
      }
    }
  })

  return parsed
}

export class CustomDirectiveChange implements AutoFormatChange {
  shortcut: string
  type: AutoFormatChangeType
  data?: ChangeData
  trigger: string

  constructor(shortcut:string, data?: ChangeData) {
    this.shortcut = shortcut
    if (data) this.data = data
    this.type = 'CustomDirectiveChange'
    this.trigger = ' '
  }

  getMarkdownFromCurrentCursorPosition(editor: Editor):string|null {
    const textBeforeCursor = getTextFromBlockStartToCursor(editor);
    const matchDirective = new RegExp('(:+(?<type>.*)\\[(?<text>.*)]{(?<attributes>.*)})\\s*$', 'mg')
    const matches = matchDirective.exec(textBeforeCursor);
    if (!matches) return null; 
    return matches[0];
  }

  apply(editor: Editor, text:string): boolean {
    const isTrigger = text === this.trigger;
    const markdownString = isTrigger ? this.getMarkdownFromCurrentCursorPosition(editor) : text;
    if (!markdownString) return false;
    try {
      const parsed = getSlateEditorStateFromMarkdownSync(markdownString)
      if(!parsed) return false;
      const {editorState: [parsedNode]} = parsed;
      if (parsedNode.type !== this.shortcut) return false;
      const [start] = Range.edges(editor.selection as Range);
      const charBefore = Editor.before(editor, start, {
	unit: 'character',
	distance: markdownString.length,
      }) as Point;
      if (isTrigger) {
	Transforms.delete(editor, {
	  at: {
	    anchor: charBefore,
	    focus: start
	  }
	})
      }
      Transforms.insertNodes(
	editor,
	parsedNode
      )
      return true
    } catch {
      return false;
    }
  }
}
