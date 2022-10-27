import style from "./SquareContainer.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {}
export function SquareContainer({ children }: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.content)}>{children}</div>
    </div>
  )
}
