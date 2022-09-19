import style from "./Tag.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {}
export function Tag({ children }: PropsWithChildren<Props>) {
  return <div className={cs(style.root)}>{children}</div>
}
