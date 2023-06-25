import style from "./Infobox.module.scss"
import cs from "classnames"
import { PropsWithChildren, ReactChild } from "react"

interface Props {
  icon?: ReactChild
}
export function Infobox({ icon, children }: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      {icon && <div className={cs(style.icon)}>{icon}</div>}
      <div>{children}</div>
    </div>
  )
}
