import style from "./Submit.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  layout?: "left"|"center"
}
export function Submit({
  layout,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root, style[`layout_${layout}`])}>
      {children}
    </div>
  )
}