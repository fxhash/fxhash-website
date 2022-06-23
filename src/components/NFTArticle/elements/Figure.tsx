import { PropsWithChildren, useEffect, useRef } from "react"
import ReactTextareaAutosize from "react-textarea-autosize"
import { Transforms } from "slate"
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
  const focused = useFocused()

  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)
  
  const deleteNode = () => {
    Transforms.removeNodes(editor, {
      at: path
    })
  }

  return (
    <figure {...attributes} className={cs(style.figure, {
      [style.selected]: selected && focused
    })}>
      <button
        type="button"
        className={cs(style.delete)}
        onClick={deleteNode}
        contentEditable={false}
      >
        <i className="fa-solid fa-trash-can" aria-hidden/>
      </button>
      {children}
    </figure>
  )
}