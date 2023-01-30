import { FunctionComponent } from "react"
import Link from "next/link"

interface Props {
  href: string
  iconComp: React.ReactNode
  newTab?: boolean
  iconSide?: "left" | "right"
}

export const LinkIcon: FunctionComponent<Props> = ({
  href,
  iconComp,
  newTab = false,
  iconSide = "left",
  children,
}) => {
  return (
    <Link href={href}>
      <a target={newTab ? "_blank" : "_self"}>
        {iconSide === "left" ? (
          <>
            {iconComp} {children}
          </>
        ) : (
          <>
            {children} {iconComp}
          </>
        )}
      </a>
    </Link>
  )
}
