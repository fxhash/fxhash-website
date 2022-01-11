import style from "./FiltersPanel.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  
}
export function FiltersPanel({
  children
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      {children}
    </div>
  )
}