import { PropsWithChildren, useMemo } from "react"

interface Props {
  href: string
}
export function LinkElement({ href, children }: PropsWithChildren<Props>) {
  const aProps = useMemo(() => {
    const url = new URL(href)
    return url.hostname.endsWith("fxhash.xyz")
      ? { target: "_self", rel: "noopener" }
      : { target: "_blank", rel: "noopener nofollow" }
  }, [href])
  return (
    <a href={href} target={aProps.target} rel={aProps.rel}>
      {children}
    </a>
  )
}
