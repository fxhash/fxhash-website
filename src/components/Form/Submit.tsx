import style from "./Submit.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  
}
export function Submit({
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      {children}
    </div>
  )
}