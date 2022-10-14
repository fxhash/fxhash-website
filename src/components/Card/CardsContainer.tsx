import style from "./CardsContainer.module.scss"
import cs from "classnames"
import { forwardRef } from "react"
import { ICardContainerProps } from "../../types/Components/CardsContainer"

interface Props extends ICardContainerProps {}
export const CardsContainer = forwardRef<HTMLDivElement, Props>(
  (
    { children, cardSize, addDivs = true, ...props }: Props,
    ref
  ) => {
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
        {addDivs && (
          <>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </>
        )}
      </div>
    )
  }
)
CardsContainer.displayName = "CardsContainer"
