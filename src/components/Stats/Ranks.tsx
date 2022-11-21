import { PropsWithChildren } from "react"
import style from "./Ranks.module.scss"
import cs from "classnames"

interface Props {
  className?: string
}
export function Ranks({ children, className }: PropsWithChildren<Props>) {
  return <div className={cs(style.root, className)}>{children}</div>
}
