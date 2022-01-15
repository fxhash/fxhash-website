import { PropsWithChildren } from "react"
import style from "./Ranks.module.scss"
import cs from "classnames"



interface Props {
  
}
export function Ranks({
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      { children }
    </div>
  )
}