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