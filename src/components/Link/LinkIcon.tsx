import { FunctionComponent } from "react"
import Link from "next/link"


interface Props {
  href: string
  iconComp: React.ReactNode
  newTab?: boolean
}

export const LinkIcon: FunctionComponent<Props> = ({
  href,
  iconComp,
  newTab = false,
  children
}) => {
  return (
    <Link href={href}>
      <a target={newTab ? "_blank" : "_self"}>
        {iconComp} {children} 
      </a>
    </Link>
  )
}