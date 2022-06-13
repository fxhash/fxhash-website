import {Range, Path, Text, Node,  Editor,Transforms, Location} from 'slate'; 

type AutoFormatChangeType = "BlockTypeChange" | "InlineTypeChange" | "CustomDirectiveChange";
type ChangeData = {[key: string]: number | string | boolean}

type AutoFormatChange = {
  shortcut: string
  type: AutoFormatChangeType
  data: ChangeData
}

class InlineTypeChange implements AutoFormatChange {
  shortcut: string
  type: AutoFormatChangeType
  data: ChangeData

  constructor(shortcut:string, data: ChangeData) {
    this.shortcut = shortcut
    this.data = data
    this.type = 'InlineTypeChange' 
  }
}


class BlockTypeChange implements AutoFormatChange {
  shortcut: string 
  type: AutoFormatChangeType
  data: ChangeData
  
  constructor(shortcut:string, data: ChangeData) {
    this.shortcut = shortcut
    this.data = data
    this.type = 'BlockTypeChange' 
  }
}

class CustomDirectiveChange implements AutoFormatChange {
  shortcut: string 
  type: AutoFormatChangeType
  data: ChangeData
  
  constructor(shortcut:string, data: ChangeData) {
    this.shortcut = shortcut
    this.data = data
    this.type = 'CustomDirectiveChange'
  }


  apply(editor: Editor) {
    
  }
}

function createChangeTypeHeading():AutoFormatChange[] {
  const changes = [];
  for(let i = 1; i < 6; i++) {
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
  new InlineTypeChange('__', {strong: true}), 
  new InlineTypeChange('_', {emphasis: true}), 
]

function applyChangeBlockType(
  editor: Editor, 
  change:AutoFormatChange): void {
  Transforms.delete(editor, {
    at: getRangeBeforeCursor(editor),
  })
  Transforms.setNodes(
    editor,
    { ...change.data },
  )
  }

function getSelectionAccrossNodes(
  editor: Editor, 
  startOffset:number,
  endOffset:number, 
  shortcut: string
): Range {  
  const block = Editor.above(editor, {
    match: n => Editor.isBlock(editor, n),
  })
  const { selection } = editor
  const { anchor, focus } = block[0].children.reduce((acc, node: Node, index: number) => {
    const { anchor } = selection as Range
    acc.sum += node.text?.length || 0;
    if(acc.sum > startOffset && !acc.anchor && node.text?.indexOf(shortcut) > -1) {
      acc.anchor = {
	path: [anchor.path[0], index], 
	offset: node.text?.indexOf(shortcut)
      };
    }
    if(acc.sum >= endOffset && !acc.focus&& node.text?.indexOf(shortcut) > -1) {
      acc.focus = {
	path: [anchor.path[0], index], 
	offset: node.text?.lastIndexOf(shortcut) + shortcut.length
      };
    }
    return acc;
  }, {sum: 0})
  return { anchor,  focus };
}

function applyChangeInlineType(
  editor: Editor, 
  change: AutoFormatChange,
  beforeText: string
): void {
  // retreive the matches based on usual markdown pattern, e.g.
  // __bold__, _italic_, etc.
  const matcher = RegExp(`${change.shortcut}(.*?)${change.shortcut}`, 'g')
  const matches = beforeText.match(matcher);
  if (!matches) return;
  // We need to get a slate Point for the matched string inside the 
  // editor state. Since the text can be split up into multiple nodes
  // and the selection can go across them, we need to retrieve the
  // selection across multiple nodes
  const matchStartIndex = beforeText.indexOf(matches[0])
  const matchEndIndex = matchStartIndex + matches[0].length;
  const inlineRange = getSelectionAccrossNodes(
    editor,
    matchStartIndex,
    matchEndIndex,
    change.shortcut
  )
  Transforms.select(editor, inlineRange)
  // For each value in data add a mark to the node
  Object.keys(change.data).forEach((key: string) => {
    const value = change.data[key];
    editor.addMark(key, value);
  })
  Transforms.collapse(editor, {edge: 'anchor'})
  // Now lets cleanup the md shortcuts from the text.
  // Setting the marks on text nodes can result in a new structure
  // because elements might be split up to apply the styles.
  // Therefore we retrieve the updated selection of the matched string.
  const inlineRangeCleanup = getSelectionAccrossNodes(
    editor, 
    matchStartIndex, 
    matchEndIndex,
    change.shortcut
  )
  // Create a range that matches the md shortcut 
  // before the search string (anchor)
  const rangeBefore = {
    anchor: inlineRangeCleanup.anchor,
    focus: {
      ...inlineRangeCleanup.anchor, 
      offset: inlineRangeCleanup.anchor.offset + change.shortcut.length
    }
  }
  Transforms.delete(
    editor, 
    {
      at: rangeBefore
    }
  )
  // If the whole matched string is only contained in one text node
  // instead of covering multiple nodes the,
  const inSameNode = Path.equals(
    inlineRangeCleanup.focus.path,
    inlineRangeCleanup.anchor.path
  )
  // the range after the matched string needs to be offset
  // by an addtional md shortcut length, as it was already substracted
  // in the previous step
  const focusOffset = inlineRangeCleanup.focus.offset - (change.shortcut.length * (inSameNode ? 1 :0))
  const anchorOffset = focusOffset - change.shortcut.length  
  // Create a range that matches the md shortcut 
  // fater the search string (focus)
  const rangeAfter  = {
    anchor: {
      ...inlineRangeCleanup.focus,
      offset: anchorOffset, 
    }, 
    focus: {
      ...inlineRangeCleanup.focus, 
      offset: focusOffset, 
    },
  }
  Transforms.delete(
    editor, 
    {
      at: rangeAfter, 
    }
  )
}

function getRangeBeforeCursor(editor: Editor): Range {
  const { anchor } = editor.selection as Range
  const block = Editor.above(editor, {
    match: n => Editor.isBlock(editor, n),
  })
  const path = block ? block[1] : []
  const start = Editor.start(editor, path)
  const range = { anchor, focus: start }
  return range;
}

export const withAutoFormat = (editor: Editor) => {
  const {insertText } = editor;
 
  editor.insertText = text => {
    const { selection } = editor
    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const range = getRangeBeforeCursor(editor)
      const beforeText = `${Editor.string(editor, range)} `
      const change = config.find(change =>  {
	if(change.type === 'BlockTypeChange') {
	  return beforeText.startsWith(`${change.shortcut} `)
	} else if (change.type === 'InlineTypeChange') {
	  const matcher = RegExp(`${change.shortcut}(.*?)${change.shortcut}`, 'g')
	  const matches = beforeText.match(matcher);
	  return matches?.length > 0;
	}
	return false;
      });
      switch(change?.type) { 
	case 'BlockTypeChange':
	  return applyChangeBlockType(editor, change)
	case 'InlineTypeChange': 
	  return applyChangeInlineType(editor, change, beforeText)
      }
    }
    insertText(text)
  }

  return editor
}
