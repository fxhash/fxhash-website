import { PropsWithChildren, useEffect, useRef } from "react"
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
  const focused = useFocused()
  const editor = useSlateStatic();

  const handleFocus = () => {
    const slateNode = ReactEditor.toSlateNode(editor, attributes.ref.current);
    const path = ReactEditor.findPath(editor, slateNode)
    const captionText = Node.string(slateNode)
    const point = {path: [...path, 1], offset: captionText.length }
    Transforms.select(editor, point)
  }

  return (
    <figure {...attributes} onFocus={handleFocus} tabIndex="0" className={cs(style.figure, {
      [style.selected]: selected && focused
    })}>
      {children}
    </figure>
  )
}

