import style from "./MintingStateTimer.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"
import { Countdown } from "../../Utils/Countdown"

interface Props {
  until: Date
  icon?: string
}
export function MintingStateTimer({
  until,
  icon = "fa-solid fa-clock",
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      <i className={icon} aria-hidden />
      {children} <Countdown className={style.countdown} until={until} />
    </div>
  )
}
