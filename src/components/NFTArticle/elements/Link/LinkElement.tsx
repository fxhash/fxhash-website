import { PropsWithChildren, useMemo } from "react"

interface Props {
  href: string
}
export function LinkElement({ href, children }: PropsWithChildren<Props>) {
  const aProps = useMemo(() => {
    try {
      const fullHref = href.startsWith("https://") ? href : `https://${href}`
      const url = new URL(fullHref)
      return url.hostname.endsWith("fxhash.xyz")
        ? { href: fullHref, target: "_self", rel: "noopener" }
        : { href: fullHref, target: "_blank", rel: "noopener nofollow" }
    } catch (e) {
      return { href, target: "_blank", rel: "noopener nofollow" }
    }
  }, [href])
  return (
    <a href={aProps.href} target={aProps.target} rel={aProps.rel}>
      {children}
    </a>
  )
}
