import style from "./FlagBanner.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

export function FlagBanner({ children }: PropsWithChildren<{}>) {
  return (
    <div className={cs(layout['padding-small'])}>
      <div className={cs(style.banner)}>
        <i aria-hidden className="fas fa-exclamation-triangle"/>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}