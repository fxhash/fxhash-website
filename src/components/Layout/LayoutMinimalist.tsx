import React, { memo, PropsWithChildren, useContext } from "react"
import cs from "classnames"
import { HeaderMinimalist } from "./HeaderMinimalist"
import style from "./LayoutMinimalist.module.scss"

interface LayoutMinimalistProps extends PropsWithChildren<{}> {}
const _LayoutMinimalist = ({ children }: LayoutMinimalistProps) => {
  return (
    <div className={style.screen}>
      <HeaderMinimalist />

      <main className={style.main}>{children}</main>
    </div>
  )
}

export const LayoutMinimalist = memo(_LayoutMinimalist)
