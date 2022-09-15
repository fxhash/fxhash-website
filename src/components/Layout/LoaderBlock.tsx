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
  size?: "tiny" | "small" | "regular" | "large"
}

export function LoaderBlock({
  height,
  className,
  textPos = "top",
  color = "black",
  size = "regular",
  children
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.container, style[textPos], colors[color], className)} style={{ height }}>
      {children}
      <Loader color={color} size={size} />
    </div>
  )
}