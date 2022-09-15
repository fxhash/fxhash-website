import React, { HTMLAttributes, PropsWithChildren } from "react"

interface Props extends HTMLAttributes<HTMLButtonElement & HTMLAnchorElement> {
  isLink: boolean
}

export const ButtonOrLink = React.forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  Props
>(({ isLink, ...props }: Props, ref) => {
  return isLink ? <a ref={ref} {...props} /> : <button ref={ref} {...props} />
})
ButtonOrLink.displayName = "ButtonOrLink"
