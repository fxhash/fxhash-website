import { PropsWithChildren } from "react"
import style from "./Dropdown.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"

interface Props {
  opened: boolean
  className?: string
  direction: "top" | "bottom"
}

export function DropdownMenu({
  opened,
  className,
  children,
  direction,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={cs(style.menu, className, effects["drop-shadow-big"], {
        [style["menu-opened"]]: opened,
        [style["menu-top"]]: direction === "top",
      })}
    >
      {children}
    </div>
  )
}
