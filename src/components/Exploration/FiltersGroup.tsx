import style from "./FiltersGroup.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  title: string
}
export function FiltersGroup({
  title,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.title)}>{title} (tez)</div>
      <div className={cs(style.content)}>{children}</div>
    </div>
  )
}