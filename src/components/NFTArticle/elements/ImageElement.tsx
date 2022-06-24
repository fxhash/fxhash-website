import { PropsWithChildren } from "react"
import ReactTextareaAutosize from "react-textarea-autosize"
import { Transforms } from "slate"
import { ReactEditor, useFocused, useSelected, useSlateStatic } from "slate-react"
import style from "./ImageElement.module.scss"
import cs from "classnames"


interface Props {
  attributes: any
  element: any
}
export function ImageElement({
  attributes,
  element,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div {...attributes}>
      {children}
      <img
        src={element.url as string}
        title={element.title as string}
        alt={element.alt as string}
      />
    </div>
  )
}