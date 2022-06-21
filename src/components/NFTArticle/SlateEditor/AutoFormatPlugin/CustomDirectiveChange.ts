import { Range, Point,  Node,  Editor, Transforms, Ancestor, NodeEntry } from 'slate'; 
import { AutoFormatChangeType, ChangeData, AutoFormatChange } from './index'; 
import { customNodes } from '../../processor';
import { getTextFromBlockStartToCursor } from '../utils';

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

  constructor(shortcut:string, data?: ChangeData) {
    this.shortcut = shortcut
    if (data) this.data = data
    this.type = 'CustomDirectiveChange'
  }

  apply(editor: Editor): boolean {
    const textBeforeCursor = getTextFromBlockStartToCursor(editor);
    const matchDirective = new RegExp('(:*s*(?<type>[^\\s]*)\\s*\\[(?<text>.*)]\\s*{(?<attributes>.*)})', 'mg')
    const matches = matchDirective.exec(textBeforeCursor);
    if (!matches) return false;
    const type = matches.groups?.['type']
    const text = matches.groups?.['text']
    const attributes = matches.groups?.['attributes']
    if (!type) return false;
    const parsedAttributes = parseAttributes(attributes)
    const nodeAttributes = {
      value: text,
      type,
      ...parsedAttributes.attributes
    }
    const props = customNodes.leafDirective[type]?.getPropsFromNode?.(null, nodeAttributes) || nodeAttributes;
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
      { 
	...props,
	type:props.type, 
	children: [{text: props.value}],
      }
    )
    return true; 
  }
}
