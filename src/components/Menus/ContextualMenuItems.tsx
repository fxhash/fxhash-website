import style from "./ContextualMenu.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  
}
export function ContextualMenuItems({
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.items)}>
      {children}
    </div>
  )
}