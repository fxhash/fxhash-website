import { FunctionComponent } from "react"
import { LinkIcon } from "./LinkIcon"

interface Props {
  href: string
  newTab?: boolean
}

export const LinkGuide: FunctionComponent<Props> = ({
  href,
  newTab,
  children,
}) => {
  return (
    <LinkIcon
      iconComp={<i aria-hidden className="fas fa-book" />}
      href={href}
      newTab={newTab}
    >
      {children}
    </LinkIcon>
  )
}
