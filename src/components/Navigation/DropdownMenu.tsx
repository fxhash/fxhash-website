import { PropsWithChildren } from "react"
import style from "./Dropdown.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"


interface Props {
  opened: boolean
}

export function DropdownMenu({ opened, children }: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.menu, effects['drop-shadow-big'], {
      [style['menu-opened']]: opened
    })}>
      { children }
    </div>
  )
}