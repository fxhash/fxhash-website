import { ReactChild, useEffect, useRef, useState } from 'react'
import style from "./CardsContainer.module.scss"
import cs from "classnames"
import { HTMLAttributes, PropsWithChildren } from "react"

interface Props extends HTMLAttributes<HTMLDivElement> {
  
}

const fillCols = (children: ReactChild[], cols) => {
  if(children) {
    children.forEach((child, i) => cols[i % cols.length].push(child))
  }
}

export function CardsContainer({
  children,
  ...props
}: PropsWithChildren<Props>) {

  const ref = useRef()
  const [numCols, setNumCols] = useState(4)
  const cols = [...Array(numCols)].map(() => [])
  fillCols(children[0], cols)

  return (
    <div {...props} className={cs(style.container, props.className)}>
        {[...Array(numCols)].map((_, index) => (
        <div key={index} className="col">
          {cols[index]}
        </div>

      ))}
    </div>
  )
}