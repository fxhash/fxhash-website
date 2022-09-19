import style from "./CardListsContainer.module.scss"
import cs from "classnames"
import { forwardRef, HTMLAttributes, PropsWithChildren } from "react"

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const CardListsContainer = forwardRef<HTMLDivElement, Props>(
  ({ children, ...props }: PropsWithChildren<Props>, ref) => {
    return (
      <div
        {...props}
        className={cs(style.container, props.className)}
        ref={ref}
      >
        {children}
      </div>
    )
  }
)
CardListsContainer.displayName = "CardListsContainer"
