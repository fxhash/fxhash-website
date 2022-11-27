import style from "./InfoIconLink.module.scss"
import cs from "classnames"
import Link from "next/link"
import { HTMLAttributeAnchorTarget } from "react"
import { Icon } from "./Icon"

interface Props {
  href: string
  target?: HTMLAttributeAnchorTarget
  title?: string
}
export function InfoIconLink({ href, target = "_blank", title }: Props) {
  return (
    <Link href={href}>
      <a target={target} className={cs(style.root)} title={title}>
        <Icon icon="infos-circle" />
      </a>
    </Link>
  )
}
