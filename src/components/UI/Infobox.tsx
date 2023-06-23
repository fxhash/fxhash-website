import style from "./Infobox.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"
import { Icon } from "components/Icons/Icon"

type Props = PropsWithChildren<{
  className?: string
}>
export function Infobox({ children, className }: Props) {
  return (
    <div className={cs(style.root, className)}>
      <Icon icon="infos-square" className={cs(style.icon)} />
      <span>{children}</span>
    </div>
  )
}
