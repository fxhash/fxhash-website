import { PropsWithChildren } from "react"

interface Props {
  href: string
}
export function LinkElement({ href, children }: PropsWithChildren<Props>) {
  return <a href={href}>{children}</a>
}
