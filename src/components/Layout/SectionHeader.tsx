import style from "./SectionHeader.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {

}

export function SectionHeader({ children }: PropsWithChildren<Props>) {
  return (
    <header className={cs(style.container, layout['padding-small'])}>
      { children }
    </header>
  )
}