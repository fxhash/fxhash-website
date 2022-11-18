import { MouseEventHandler } from "react"
import { hasFixedPosition } from "./css"

export const stopEvent: MouseEventHandler = (event) => {
  event.stopPropagation()
  event.preventDefault()
}

export function withStopPropagation(fn: (event: any) => void) {
  return (event: any) => {
    event.stopPropagation()
    fn(event)
  }
}

export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T["addEventListener"]> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(
      ...(args as Parameters<HTMLElement["addEventListener"]>)
    )
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args:
    | Parameters<T["removeEventListener"]>
    | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(
      ...(args as Parameters<HTMLElement["removeEventListener"]>)
    )
  }
}

export function focusAndOpenKeyboard(el: HTMLElement, timeout?: number) {
  if (!timeout) {
    timeout = 100
  }
  if (el) {
    const nodeWithFixedPosition = hasFixedPosition(el)
    const __tempEl__ = document.createElement("input")
    __tempEl__.style.position = "absolute"
    __tempEl__.style.top = el.offsetTop + 7 + "px"
    __tempEl__.style.left = el.offsetLeft + "px"
    __tempEl__.style.height = "0"
    __tempEl__.style.opacity = "0"
    __tempEl__.style.width = "1px"
    if (nodeWithFixedPosition) {
      nodeWithFixedPosition.appendChild(__tempEl__)
    } else {
      document.body.appendChild(__tempEl__)
    }
    __tempEl__.focus()

    // The keyboard is open. Now do a delayed focus on the target element
    setTimeout(function () {
      el.focus()
      el.click()
      // Remove the temp element
      if (nodeWithFixedPosition) {
        nodeWithFixedPosition.removeChild(__tempEl__)
      } else {
        document.body.removeChild(__tempEl__)
      }
    }, timeout)
  }
}
