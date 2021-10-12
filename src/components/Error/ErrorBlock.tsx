import style from "./ErrorBlock.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"


interface Props {
  title: string
}

export function ErrorBlock({ title, children }: PropsWithChildren<Props>) {
  return (
    <section className={cs(style.container)}>
      <h1>{ title }</h1>
      {children && <div>{ children }</div>}
    </section>
  )
}