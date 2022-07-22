import { PropsWithChildren, useEffect, useState } from "react"
import ReactTextareaAutosize from "react-textarea-autosize"
import { Transforms, Node } from "slate"
import { ReactEditor, useFocused, useSelected, useSlateStatic } from "slate-react"
import style from "./ImageElement.module.scss"
import cs from "classnames"


interface Props {
  attributes: any
  element: any
}
export function FigureElement({
  attributes,
  element,
  children,
}: PropsWithChildren<Props>) {
  const selected = useSelected()
  
  return (
    <figure {...attributes} className={cs(style.figure, {
      [style.selected]: selected
    })}>
      {children}
    </figure>
  )
}

