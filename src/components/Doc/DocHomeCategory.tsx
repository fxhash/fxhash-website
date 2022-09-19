import style from "./DocHomeCategory.module.scss"
import cs from "classnames"
import { IDocCategory } from "../../services/LocalFiles"
import Link from "next/link"

interface Props {
  category: IDocCategory
}
export function DocHomeCategory({ category }: Props) {
  return (
    <div className={cs(style.root)}>
      <div className={style["icon-wrapper"]}>
        <i aria-hidden className={category.icon} />
      </div>
      <div>
        <h4>{category.title}</h4>
        <div className={cs(style.content)}>
          {category.articles.map((article, idx) => (
            <Link href={`/doc/${category.link}/${article.link}`} key={idx}>
              <a className={cs(style.item)}>{article.title}</a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
