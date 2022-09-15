import style from "./ProgressModule.module.scss"
import cs from "classnames"
import { FunctionComponent } from "react"
import { Loader } from "../Loader"

interface Props {
  state: "loading" | "success" | "default"
}

export const ProgressEntry: FunctionComponent<Props> = ({
  state,
  children,
}) => {
  return (
    <div className={cs(style.entry, style[`state_${state}`])}>
      {state === "loading" && <Loader size="tiny" />}
      {state === "success" && <i aria-hidden className="fas fa-check-circle" />}
      <span>{children}</span>
    </div>
  )
}
