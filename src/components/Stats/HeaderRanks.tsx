import style from "./HeaderRanks.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {}
export function HeaderRanks({ children }: PropsWithChildren<Props>) {
  return (
    <main className={cs(layout["padding-big"])}>
      <div className={cs(style.root)}>{children}</div>
    </main>
  )
}
