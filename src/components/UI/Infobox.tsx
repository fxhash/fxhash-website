import style from "./Infobox.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"
import { Icon } from "components/Icons/Icon"

type Props = PropsWithChildren<{}>
export function Infobox({ children }: Props) {
  return (
    <div className={cs(style.root)}>
      <Icon icon="infos-square" className={cs(style.icon)} />
      <span>{children}</span>
    </div>
  )
}
