import style from "./LoaderBlock.module.scss"
import cs from "classnames"
import { Loader } from "../Utils/Loader"
import { PropsWithChildren } from "react"

interface Props {
  height?: string
  className?: string
}

export function LoaderBlock({
  height,
  className,
  children
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.container, className)} style={{ height }}>
      {children}
      <Loader />
    </div>
  )
}