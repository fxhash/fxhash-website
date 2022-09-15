import style from "./ArticleContent.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  className?: string
}
export function Article({ className, children }: PropsWithChildren<Props>) {
  return <article className={cs(style.article, className)}>{children}</article>
}
