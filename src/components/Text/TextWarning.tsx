import style from "./TextWarning.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {}
export function TextWarning({ children }: PropsWithChildren<Props>) {
  return (
    <span className={cs(style.root)}>
      <i className="fa-solid fa-triangle-exclamation" aria-hidden />
      <span>{children}</span>
    </span>
  )
}
