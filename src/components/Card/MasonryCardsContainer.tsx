import { ReactChild, useEffect, useRef, useState, useCallback } from "react"
import style from "./MasonryCardsContainer.module.scss"
import cs from "classnames"
import { HTMLAttributes, PropsWithChildren } from "react"

import { useEventListener } from "../../utils/useEventListener"
import { ICardContainerProps } from "../../types/Components/CardsContainer"

interface Props extends ICardContainerProps {
  children?: ReactChild[]
}

const fillCols = (children: ReactChild[], cols: Array<ReactChild[]>) => {
  children.forEach((child, i) => cols[i % cols.length].push(child))
}

export function MasonryCardsContainer({
  children,
  cardSize = 270,
  addDivs = false,
  ...props
}: PropsWithChildren<Props>) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [numCols, setNumCols] = useState<number>(3)
  const cols = [...Array(numCols)].map(() => [])
  children && fillCols(children, cols)

  const resizeHandler = useCallback(() => {
    if (elementRef.current) {
      const cardsGap = +getComputedStyle(document.documentElement)
        .getPropertyValue("--cards-gap")
        .replace("px", "")
      const numCols = Math.max(
        1,
        Math.floor(
          (elementRef.current.offsetWidth + cardsGap) / (cardSize + cardsGap)
        )
      )
      setNumCols(numCols)
    }
  }, [elementRef, cardSize, setNumCols])

  useEffect(resizeHandler, [resizeHandler])
  useEventListener(`resize`, resizeHandler)

  return (
    <div
      {...props}
      ref={elementRef}
      className={cs(style.container, props.className)}
      style={{
        gridTemplateColumns:
          cardSize && `repeat(auto-fit, minmax(${cardSize}px, 1fr))`,
        ...props?.style,
      }}
    >
      {[...Array(numCols)].map((_, index) => (
        <div key={index} className={style.col}>
          {cols[index]}
        </div>
      ))}
    </div>
  )
}

MasonryCardsContainer.displayName = "MasonryCardsContainer"
