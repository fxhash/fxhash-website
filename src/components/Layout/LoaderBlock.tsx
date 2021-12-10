import style from "./LoaderBlock.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { Loader } from "../Utils/Loader"
import { PropsWithChildren } from "react"

interface Props {
  height?: string
  className?: string
  textPos?: "top" | "bottom"
  color?: "white" | "black"
}

export function LoaderBlock({
  height,
  className,
  textPos = "top",
  color = "black",
  children
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.container, style[textPos], colors[color], className)} style={{ height }}>
      {children}
      <Loader color={color} />
    </div>
  )
}