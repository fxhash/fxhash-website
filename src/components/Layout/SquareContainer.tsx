import style from "./SquareContainer.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  className?: string
}
export function SquareContainer({
  className,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root, className)}>
      <div className={cs(style.content)}>{children}</div>
    </div>
  )
}
