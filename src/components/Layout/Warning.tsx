import style from "./Warning.module.scss"
import cs from "classnames"
import { FunctionComponent } from "react"
import Link from "next/link"

export const Warning: FunctionComponent = ({ children }) => {
  return (
    <Link href="/doc/fxhash/one">
      <a className={cs(style.container)}>
        <span className={cs(style.message)}>
          <i aria-hidden className="fa-solid fa-party-horn"/>
          {children}
        </span>
      </a>
    </Link>
  )
}
