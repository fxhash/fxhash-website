import {Range,Text,  Editor,Transforms} from 'slate'; 

export const withAutoFormat = editor => {
  const {insertText, isInline} = editor;

  // editor.isInline = e => e.type === 'inlineMath' ? true : isInline(e) 
  
  editor._insertText = text => {
    const { selection } = editor

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }
      const beforeText = Editor.string(editor, range)
      const rangeToReplace = {anchor: focus}
      console.log('---> text', beforeText)
      Transforms.select(editor, range)
      editor.addMark('strong', true)
      Transforms.collapse(editor, {edge: 'anchor'})
/*
       *
       *
      const type = SHORTCUTS[beforeText]

      if (type) {
        Transforms.select(editor, range)
        Transforms.delete(editor)
        const newProperties: Partial<SlateElement> = {
          type,
        }
        Transforms.setNodes<SlateElement>(editor, newProperties, {
          match: n => Editor.isBlock(editor, n),
        })

        if (type === 'list-item') {
          const list: BulletedListElement = {
            type: 'bulleted-list',
            children: [],
          }
          Transforms.wrapNodes(editor, list, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'list-item',
          })
        }

        return
      }
      */
    }
    console.log('-------->')
    insertText(text)
  }

  return editor
}
