import { Range, Point, Editor, Transforms, Node } from 'slate';
import { AutoFormatChangeType, ChangeData, AutoFormatChange } from './index';
import { getTextFromBlockStartToCursor } from '../../utils';
import { getSlateEditorStateFromMarkdownSync, PayloadSlateEditorStateFromMarkdown } from '../../../processor/getSlateEditorStateFromMarkdown';

interface ILinkAndFigureClassification {
  markdown: string
  type: 'figure'|'link'
}

function classifyMarkdown(markdown:string): ILinkAndFigureClassification {
  const firstChar = markdown.charAt(0)
  if (firstChar === '!'){
    return {
      type: 'figure',
      markdown, 
    }
  }
  const needsTrimming = firstChar !== '[';
  return {
    type: 'link',
    markdown:  needsTrimming ? markdown.substring(1) : markdown
  }
}

function getNodeToInsert(type:string, parsedMarkdown:PayloadSlateEditorStateFromMarkdown): Node|null {
  switch(type) {
    case 'figure': 
      return parsedMarkdown?.editorState?.[0]
    case 'link':
      return parsedMarkdown?.editorState?.[0]?.children?.[0];
    default: 
      return null;
  }
}

export class LinkAndFigureAutoFormat implements AutoFormatChange {
  shortcut: string[]
  type: AutoFormatChangeType
  data?: ChangeData
  trigger: string

  constructor(data?: ChangeData) {
    this.shortcut = ['link', 'figure']
    if (data) this.data = data
    this.type = 'LinkAndFigureAutoFormat'
    this.trigger = ' '
  }

  apply(editor: Editor, text: string): boolean {
    const isTrigger = text === this.trigger;
    const mdText = isTrigger ? getTextFromBlockStartToCursor(editor) : text;
    const matcher = new RegExp('.?\\[(?<text>.+?)\\]\\((?<attribute>.+?\\))', 'gm')
    const matches = matcher.exec(mdText)
    if (!matches) return false
    const matchedMarkdown = matches[0] 
    if (!matchedMarkdown) return false;
    try {
      const { type, markdown } = classifyMarkdown(matchedMarkdown)
      const parsed = getSlateEditorStateFromMarkdownSync(markdown)
      if (!parsed) return false;
      const nodeToInsert = getNodeToInsert(type, parsed)
      if (!nodeToInsert || !this.shortcut.includes(nodeToInsert.type)) return false;
      const [start] = Range.edges(editor.selection as Range);
      const charBefore = Editor.before(editor, start, {
	unit: 'character',
	distance: markdown.length,
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
	[nodeToInsert, {text: " "}], 
      )
      return true   
    } catch (e) {
      console.error(e)
      return false;
    }
  }
}
