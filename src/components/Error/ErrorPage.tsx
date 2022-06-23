import style from "./ErrorPage.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  title: string
}
export function ErrorPage({
  title,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root, layout.y_centered, layout.full_body_height)}>
      <h1>{title}</h1>
      <div>{children}</div>
    </div>
  )
}