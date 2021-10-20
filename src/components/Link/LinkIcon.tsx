import { FunctionComponent } from "react"
import Link from "next/link"


interface Props {
  href: string
  iconComp: React.ReactNode
}

export const LinkIcon: FunctionComponent<Props> = ({
  href,
  iconComp,
  children
}) => {
  return (
    <Link href={href}>
      <a>
        {iconComp} {children} 
      </a>
    </Link>
  )
}