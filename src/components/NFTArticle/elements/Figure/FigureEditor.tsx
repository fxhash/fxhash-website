import { PropsWithChildren } from "react"
import { useSelected } from "slate-react"
import style from "./FigureEditor.module.scss"
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

