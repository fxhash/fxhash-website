// import style from "./Icon.module.scss"
import cs from "classnames"

type TIcon = "infos-circle"

const icons: Record<TIcon, string> = {
  "infos-circle": "fa-solid fa-circle-info",
}

interface Props {
  icon: TIcon
  className?: string
}
export function Icon({ icon, className }: Props) {
  return <i className={cs(icons[icon], className)} aria-hidden />
}
