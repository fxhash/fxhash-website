import { PropsWithChildren, useMemo } from "react"
import { sanitizeUrl } from "./LinkDefinition"

interface Props {
  href: string
}
export function LinkElement({ href, children }: PropsWithChildren<Props>) {
  const sanitized = useMemo(() => sanitizeUrl(href), [href])
  return <a href={sanitized}>{children}</a>
}
