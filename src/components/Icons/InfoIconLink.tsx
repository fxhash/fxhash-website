import style from "./InfoIconLink.module.scss"
import cs from "classnames"
import Link from "next/link"
import { HTMLAttributeAnchorTarget } from "react"

interface Props {
  href: string
  target?: HTMLAttributeAnchorTarget
  title?: string
}
export function InfoIconLink({ href, target = "_blank", title }: Props) {
  return (
    <Link href={href}>
      <a target={target} className={cs(style.root)} title={title}>
        <i className="fa-solid fa-circle-info" aria-hidden />
      </a>
    </Link>
  )
}
