import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  Children,
  forwardRef,
  useImperativeHandle,
} from "react"
import style from "./MasonryCardsContainer.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

import { ICardContainerProps } from "../../types/Components/CardsContainer"

interface Props extends ICardContainerProps {}

const fillCols = (children: ReactNode, nbCols: number) => {
  const childrenArray = Children.toArray(children)
  const cols: ReactNode[][] = [...Array(nbCols)].map(() => [])
  childrenArray.forEach((child, i) => cols[i % nbCols].push(child))
  return cols
}

export const MasonryCardsContainer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<Props>
>(({ children, cardSize = 270, emptyDivs = 0, ...props }, ref) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [numCols, setNumCols] = useState<number>(3)
  const cols = useMemo(() => {
    return children && fillCols(children, numCols)
  }, [children, numCols])

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
  }, [cardSize, setNumCols])

  useImperativeHandle(ref, () => elementRef.current as HTMLDivElement, [
    elementRef,
  ])
  useEffect(resizeHandler, [resizeHandler])

  useEffect(() => {
    window.addEventListener("resize", resizeHandler)
    return () => {
      window.removeEventListener("resize", resizeHandler)
    }
  }, [resizeHandler])
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
      {cols &&
        [...Array(numCols)].map((_, index) => (
          <div key={index} className={style.col}>
            {cols[index]}
          </div>
        ))}
    </div>
  )
})

MasonryCardsContainer.displayName = "MasonryCardsContainer"
