import style from "./DocSidebarCategory.module.scss"
import cs from "classnames"
import { IDocCategory } from "../../services/LocalFiles"
import Link from "next/link"
import { useState } from "react"

interface Props {
  category: IDocCategory
  activeArticle: string
  activeCategory: string
}
export function DocSidebarCategory({
  category,
  activeArticle,
  activeCategory,
}: Props) {
  const [opened, setOpened] = useState(category.link === activeCategory)

  return (
    <div
      className={cs(style.root, {
        [style.opened]: opened,
      })}
    >
      <button className={cs(style.title)} onClick={() => setOpened(!opened)}>
        <i className={category.icon} aria-hidden />
        <span>{category.title}</span>
        {opened ? (
          <i className="far fa-minus" aria-hidden />
        ) : (
          <i className="far fa-plus" aria-hidden />
        )}
      </button>
      {opened && (
        <div className={cs(style.content)}>
          {category.articles.map((article) => (
            <Link
              key={article.link}
              href={`/doc/${category.link}/${article.link}`}
            >
              <a
                className={cs({
                  [style.active]:
                    category.link === activeCategory &&
                    article.link === activeArticle,
                })}
              >
                {article.title}
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
