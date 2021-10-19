import style from "./LoaderBlock.module.scss"
import cs from "classnames"
import { Loader } from "../Utils/Loader"
import { PropsWithChildren } from "react"

interface Props {
  height?: string
  className?: string
  textPos?: "top" | "bottom"
}

export function LoaderBlock({
  height,
  className,
  textPos = "top",
  children
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.container, style[textPos], className)} style={{ height }}>
      {children}
      <Loader />
    </div>
  )
}