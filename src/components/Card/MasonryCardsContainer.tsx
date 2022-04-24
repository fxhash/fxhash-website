import { ReactChild, useEffect, useRef, useState } from 'react'
import style from "./MasonryCardsContainer.module.scss"
import cs from "classnames"
import { HTMLAttributes, PropsWithChildren } from "react"

import { useEventListener } from "../../utils/useEventListener"

const MIN_WIDTH = 400

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactChild[]
}

const fillCols = (children: ReactChild[], cols: Array<ReactChild[]>) => {
  children.forEach((child, i) => cols[i % cols.length].push(child))
}

export function MasonryCardsContainer({
  children,
  ...props
}: PropsWithChildren<Props>) {

  const elementRef = useRef<HTMLDivElement>(null);
  const [numCols, setNumCols] = useState(4)
  const cols = [...Array(numCols)].map(() => [])
  children && fillCols(children, cols)
  
  const resizeHandler = () => {
    if(elementRef.current) {
      setNumCols(Math.ceil(elementRef.current.offsetWidth / MIN_WIDTH))
    }
  }

  useEffect(resizeHandler, [])
  useEventListener(`resize`, resizeHandler)

  return (
    <div {...props} ref={elementRef} className={cs(style.container, props.className)}>
        {[...Array(numCols)].map((_, index) => (
        <div key={index} className={style.col}>
          {cols[index]}
        </div>

      ))}
    </div>
  )
}