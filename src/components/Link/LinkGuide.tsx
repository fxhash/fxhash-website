import { FunctionComponent } from "react"
import { LinkIcon } from "./LinkIcon"


interface Props {
  href: string
}

export const LinkGuide: FunctionComponent<Props> = ({
  href,
  children
}) => {
  return (
    <LinkIcon
      iconComp={<i aria-hidden className="fas fa-book"/>}
      href={href}
    >
      {children}
    </LinkIcon>
  )
}