import style from "./ThematicBreak.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"
import articleStyle from "../NFTArticle.module.scss"

interface Props {
  attributes: any
  element: any
}
export function ThematicBreak({
  attributes,
  element,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root, "hr")} {...attributes} contentEditable={false}>
      {children && <div className={cs(articleStyle.article_void)}>
        {children}
      </div>}
      <hr/>
    </div>
  )
}