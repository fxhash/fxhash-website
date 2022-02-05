import { PropsWithChildren } from "react"
import style from "./DocLayout.module.scss"
import cs from "classnames"
import { DocSidebar } from "./DocSidebar"

interface Props {
  activeCategory: string
  activeArticle: string
}
export function DocLayout({
  activeCategory,
  activeArticle,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.sidebar)}>
        <DocSidebar
          activeCategory={activeCategory}
          activeArticle={activeArticle}
        />
      </div>
      <div className={cs(style.content)}>
        {children}
      </div>
    </div>
  )
}