import style from "./CardsContainer.module.scss"
import cs from "classnames"
import { forwardRef, HTMLAttributes, PropsWithChildren } from "react"

interface Props extends HTMLAttributes<HTMLDivElement> {
  cardSize?: number
}

export const CardsContainer = forwardRef<HTMLDivElement, Props>(
  ({ children, cardSize, ...props }: PropsWithChildren<Props>, ref) => {
    return (
      <div
        {...props}
        className={cs(style.container, props.className)}
        ref={ref}
        style={{
          gridTemplateColumns:
            cardSize && `repeat(auto-fit, minmax(${cardSize}px, 1fr))`,
          ...props?.style,
        }}
      >
        {children}
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    )
  }
)
CardsContainer.displayName = "CardsContainer"
