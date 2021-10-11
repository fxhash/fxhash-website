import style from "./LoaderBlock.module.scss"
import cs from "classnames"
import { Loader } from "../Utils/Loader"
import { PropsWithChildren } from "react"

interface Props {
  height?: string
}

export function LoaderBlock({
  height,
  children
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.container)} style={{ height }}>
      {children}
      <Loader />
    </div>
  )
}