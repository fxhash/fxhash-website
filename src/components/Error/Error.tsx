import style from "./Error.module.scss"
import cs from "classnames"
import { FunctionComponent } from "react"

interface Props {
  className?: string
}

export const Error: FunctionComponent<Props> = ({ className, children }) => {
  return <div className={cs(style.error, className)}>{children}</div>
}
