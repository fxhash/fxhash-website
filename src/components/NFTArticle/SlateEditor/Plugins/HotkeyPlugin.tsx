import isHotkey from "is-hotkey"
import { Editor } from "slate"
import { toggleFormat } from "../utils"
import { TextFormatKey } from "../index"

const HOTKEYS: { [key: string]: TextFormatKey } = {
  "mod+b": "strong",
  "mod+i": "emphasis",
  "mod+`": "inlineCode",
}

export function onKeyDownHotkeyPlugin(
  editor: Editor,
  event: React.KeyboardEvent
): void {
  for (const hotkey in HOTKEYS) {
    if (isHotkey(hotkey, event as any)) {
      event.preventDefault()
      const mark = HOTKEYS[hotkey]
      toggleFormat(editor, mark)
    }
  }
}
