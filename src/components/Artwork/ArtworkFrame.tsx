import style from "./ArtworkFrame.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  borderWidth?: number
}
export function ArtworkFrame({
  borderWidth = 10,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)} style={{ borderWidth }}>
      {children}
    </div>
  )
}
