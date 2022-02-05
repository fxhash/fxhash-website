import style from "./DocSidebar.module.scss"
import cs from "classnames"
import docJSON from "../../doc/doc.json"
import { DocSidebarCategory } from "./DocSidebarCategory"
import { useState } from "react"

interface Props {
  activeCategory: string
  activeArticle: string
}
export function DocSidebar({
  activeCategory,
  activeArticle,
}: Props) {
  // only for mobile
  const [opened, setOpened] = useState(false)

  return (
    <div className={cs(style.root, {
      [style.opened]: opened
    })}>
      <button
        className={cs(style.title)}
        onClick={() => setOpened(!opened)}
      >
        <i className="fas fa-bars"/>
        <span>Documentation</span>
      </button>
  
      <div className={cs(style.content)}>
        {docJSON.categories.map((category) => (
          <DocSidebarCategory
            key={category.link}
            category={category}
            activeArticle={activeArticle}
            activeCategory={activeCategory}
          />
        ))}
      </div>
    </div>
  )
}