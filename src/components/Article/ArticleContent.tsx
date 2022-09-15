import style from "./ArticleContent.module.scss"
import cs from "classnames"


interface Props {
  content: string
}

export function ArticleContent({ content }: Props) {
  return (
    <article
      className={cs(style.article)}
      dangerouslySetInnerHTML={{
        __html: content
      }}
    />
  )
}