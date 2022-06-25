import { MouseEventHandler } from "react"

export const stopEvent: MouseEventHandler = (event) => {
  event.stopPropagation()
  event.preventDefault()
}