import React, { HTMLAttributes, PropsWithChildren } from "react"


interface Props {
}

export const AnchorForward = React.forwardRef<HTMLAnchorElement, PropsWithChildren<HTMLAttributes<HTMLAnchorElement>>>(({
  children,
  ...props
}, ref) => {
  return (
    <a ref={ref} {...props}>{ children }</a>
  )
})