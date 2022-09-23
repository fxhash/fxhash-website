import { PropsWithChildren } from "react"
import style from "./BlockquoteEditor.module.scss"
import cs from "classnames"

interface Props {
  attributes: any
  element: any
}
export function BlockquoteEditor({
  attributes,
  element,
  children,
}: PropsWithChildren<Props>) {
  return (
    <blockquote {...attributes} className={cs(style.root)}>
      {children}
    </blockquote>
  )
}
