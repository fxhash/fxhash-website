import style from "./Error.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { PropsWithChildren } from "react"


interface Props {
  title: string
  align?: "left" | "center" | "right"
}

export function ErrorBlock({ title, children, align = "center" }: PropsWithChildren<Props>) {
  return (
    <section className={cs(style.container, colors.error, style[`align_${align}`])}>
      <strong>{ title }</strong>
      {children && <span>{ children }</span>}
    </section>
  )
}