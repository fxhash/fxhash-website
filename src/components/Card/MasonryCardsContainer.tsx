import {
  ReactChild,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useCallback,
} from "react"
import style from "./MasonryCardsContainer.module.scss"
import cs from "classnames"
import { HTMLAttributes, PropsWithChildren } from "react"

import { useEventListener } from "../../utils/useEventListener"

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactChild[]
  cardSize?: number
}

const fillCols = (children: ReactChild[], cols: Array<ReactChild[]>) => {
  children.forEach((child, i) => cols[i % cols.length].push(child))
}

export function MasonryCardsContainer({
  children,
  cardSize = 270,
  ...props
}: PropsWithChildren<Props>) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [numCols, setNumCols] = useState<number>(3)
  const cols = [...Array(numCols)].map(() => [])
  children && fillCols(children, cols)

  const resizeHandler = useCallback(() => {
    if (elementRef.current) {
      const numCols = Math.max(
        1,
        Math.floor(elementRef.current.offsetWidth / cardSize) - 1
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
