import style from "./ArticleContent.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"


interface Props {
}
export function Article({ children }: PropsWithChildren<Props>) {
  return (
    <article className={cs(style.article)}>
      {children}
    </article>
  )
}