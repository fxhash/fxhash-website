import style from "./CardsContainer.module.scss"
import cs from "classnames"
import { HTMLAttributes, PropsWithChildren } from "react"

interface Props extends HTMLAttributes<HTMLDivElement> {
  
}

export function CardsContainer({
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <div {...props} className={cs(style.container, props.className)}>
      {children}
    </div>
  )
}