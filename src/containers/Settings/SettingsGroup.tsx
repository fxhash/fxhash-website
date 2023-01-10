import style from "./SettingsGroup.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  title: string
}
export function SettingsGroup({ title, children }: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      <h5 className={cs(style.title)}>{title}</h5>
      <div className={cs(style.content)}>{children}</div>
    </div>
  )
}
