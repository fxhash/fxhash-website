// import style from "./Icon.module.scss"
import cs from "classnames"

type TIcon =
  | "infos-circle"
  | "sparkles"
  | "sparkle"
  | "infos-square"
  | "arrow-left"
  | "ticket"

const icons: Record<TIcon, string> = {
  "infos-circle": "fa-solid fa-circle-info",
  sparkles: "fa-sharp fa-solid fa-sparkles",
  sparkle: "fa-sharp fa-solid fa-sparkle",
  "infos-square": "fa-sharp fa-solid fa-square-info",
  "arrow-left": "fa-sharp fa-solid fa-arrow-left",
  ticket: "fa-sharp fa-solid fa-ticket",
}

interface Props {
  icon: TIcon
  className?: string
}
export function Icon({ icon, className }: Props) {
  return <i className={cs(icons[icon], className)} aria-hidden />
}
