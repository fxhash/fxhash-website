import { MouseEventHandler } from "react"

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
  ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>));
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['removeEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>));
  }
}