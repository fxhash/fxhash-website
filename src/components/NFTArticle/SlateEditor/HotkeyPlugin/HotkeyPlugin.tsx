import isHotkey from 'is-hotkey'
import { Editor } from 'slate'; 
import { toggleMark } from '../utils';
import { TextFormatKey } from '../index';

const HOTKEYS: {[key: string]: TextFormatKey} = {
  'mod+b': 'strong',
  'mod+i': 'emphasis',
  'mod+u': 'underline',
  'mod+`': 'inlineCode',
}

export function onKeyDownHotkeyPlugin(editor: Editor, event: KeyboardEvent): void{
  for (const hotkey in HOTKEYS) {
    if (isHotkey(hotkey, event as any)) {
      event.preventDefault()
      const mark = HOTKEYS[hotkey]
      toggleMark(editor, mark)
    }
  }
}
