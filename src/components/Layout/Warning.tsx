import style from "./Warning.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { FunctionComponent } from "react"
import Link from "next/link"
import { ContractsOpened } from "../Utils/ContractsOpened"

export const Warning: FunctionComponent = ({ children }) => {
  return (
    <Link href="/articles/beta">
      <a className={cs(style.container)}>
        <span className={cs(style.message)}>
          <i aria-hidden className="fas fa-radiation-alt"/>
          {children}
        </span>
      </a>
    </Link>
  )
}