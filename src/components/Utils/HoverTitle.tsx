import style from "./HoverTitle.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  className?: string
  message?: string|null
}
export function HoverTitle({
  message,
  className,
  children
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.wrapper, className, {
      [style.hover_enabled]: !!message
    })}>
      {children}
      {message && (
        <div className={cs(style.hover_message)}>
          {message}
        </div>
      )}
    </div>
  )
}