import style from "./HeaderRanks.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  
}
export function HeaderRanks({
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      { children }
    </div>
  )
}