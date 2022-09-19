import { PropsWithChildren } from "react"
import style from "./FigureEditor.module.scss"
import cs from "classnames"

interface Props {
  attributes: any
  element: any
}
export function FigcaptionElement({
  attributes,
  element,
  children,
}: PropsWithChildren<Props>) {
  // get the text element in the children
  const text = element.children[0].text

  return (
    <figcaption
      {...attributes}
      className={cs(style.figcaption, {
        [style.empty]: text === "",
      })}
    >
      {text === "" && (
        <div className={cs(style.placeholder)} contentEditable={false}>
          Image caption...
        </div>
      )}
      {children}
    </figcaption>
  )
}
