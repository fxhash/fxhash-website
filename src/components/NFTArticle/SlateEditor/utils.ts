import { Range, Editor, Text, Transforms, Element, NodeEntry, Location } from 'slate'; 
import { useEffect } from 'react';
import isHotkey from 'is-hotkey'

export function getRangeFromBlockStartToCursor(editor: Editor): Range {
  const { anchor } = editor.selection as Range;
  const block = Editor.above(editor, {
    match: n => Editor.isBlock(editor, n),
  })
  const path = block ? block[1] : []
  const start = Editor.start(editor, path)
  const range = { anchor, focus: start }
  return range;
}

export function getRangeFromCursorToBlockEnd(editor: Editor): Range {
  const { anchor } = editor.selection as Range;
  const block = Editor.above(editor, {
    match: n => Editor.isBlock(editor, n),
  })
  const path = block ? block[1] : []
  const end = Editor.end(editor, path)
  const range = { anchor, focus: end }
  return range;
}

export function getTextFromBlockStartToCursor(editor: Editor): string {
  const range = getRangeFromBlockStartToCursor(editor)
  return Editor.string(editor, range)
}
export function getTextFromCursorToBlockEnd(editor: Editor): string {
  const range = getRangeFromCursorToBlockEnd(editor)
  return Editor.string(editor, range)
}

export function isMarkActive(editor: Editor, format: string): boolean {
  const marks = Editor.marks(editor) as {[key: string]: boolean}
  return marks ? marks[format] === true : false
}

export function toggleMark(editor: Editor, format: string): void {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export function isFormatActive(editor: Editor, format: string, options={}):boolean {
  const [match] = Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all',
    ...options
  })
  return !!match
}

export function toggleFormat(editor: Editor, format: string): void {
  const isActive = isFormatActive(editor, format);
  editor.addMark(format, !isActive)
}

export function lookupElementByType(editor:Editor, type: string): NodeEntry {
  const [element] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === type,
  })
  return element
}

export function lookupElementAtSelection(
  editor: Editor,
  selection: Location
): NodeEntry | null {
  if (!selection) return null;
  const [, nodePath] = Editor.last(editor, selection)
  return Editor.parent(editor, nodePath)
}


export function useHotkey(hotkey:string|undefined, handler:() => void, skip?: boolean|null) {
  useEffect(() => {
    if (!hotkey || skip) return;
    const handleHotKey = (event:KeyboardEvent) => {
      if (isHotkey(hotkey, event)) {
	event.preventDefault()
	handler();
      }
    }
    
    document.addEventListener("keydown", handleHotKey)
    return () => {
      document.removeEventListener("keydown", handleHotKey)
    } 
  }, [hotkey, handler, skip]);
}
