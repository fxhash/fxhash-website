import style from "./ButtonIcon.module.scss"
import cs from "classnames"
import { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string
}
export function ButtonIcon({ type = "button", icon, ...props }: Props) {
  return (
    <button type={type} {...props} className={cs(style.root, props.className)}>
      <i className={icon} aria-hidden />
    </button>
  )
}
