import style from "./ArticleContent.module.scss"
import cs from "classnames"

interface Props {
  content: string
  className?: string
}

export function ArticleContent({ content, className }: Props) {
  return (
    <article
      className={cs(style.article, className)}
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  )
}
