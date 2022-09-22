import style from "./CardsContainer.module.scss"
import cs from "classnames"
import { forwardRef, HTMLAttributes, PropsWithChildren } from "react"

interface CardsContainerProps extends HTMLAttributes<HTMLDivElement> {
  emptyDivs?: number
}

export const CardsContainer = forwardRef<HTMLDivElement, CardsContainerProps>(
  (
    {
      children,
      emptyDivs = 8,
      ...props
    }: PropsWithChildren<CardsContainerProps>,
    ref
  ) => {
    return (
      <div
        {...props}
        className={cs(style.container, props.className)}
        ref={ref}
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
