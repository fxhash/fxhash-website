import style from "./CardsContainer.module.scss"
import cs from "classnames"
import { forwardRef } from "react"
import { ICardContainerProps } from "../../types/Components/CardsContainer"

interface Props extends ICardContainerProps {}
export const CardsContainer = forwardRef<HTMLDivElement, Props>(
  ({ children, cardSize, emptyDivs = 8, ...props }: Props, ref) => {
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
        {Array(emptyDivs)
          .fill(0)
          .map((_, idx) => (
            <div key={idx} />
          ))}
      </div>
    )
  }
)
CardsContainer.displayName = "CardsContainer"
