import React from "react"
import style from "./HomeHero.module.scss"
import Link from "next/link"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { UserBadge } from "../../components/User/UserBadge"
import { NFTArticle } from "../../types/entities/Article"

const docs = [
  {
    title: "Publishing a project on fxhash",
    subtitle: "Quick start guide on creating on fxhash",
    url: "/doc/artist/guide-publish-generative-token",
  },
  {
    title: "Collecting on fxhash",
    subtitle: "How to get started to collect pieces on fxhash",
    url: "/doc/collect/guide",
  },
  {
    title: "Integration guide",
    subtitle: "For developers building on fxhash",
    url: "/doc/fxhash/integration-guide",
  },
]

interface HomeDocsProps {
  articles: NFTArticle[]
}

export function HomeDocs(props: HomeDocsProps) {
  const { articles } = props
  return (
    <div className={cs(style.articles_container, layout["padding-big"])}>
      <div className={style.articles}>
        <div className={style.docs}>
          <h6>get started docs</h6>
          <div>
            {docs.map((doc) => (
              <div className={style.doc} key={doc.title}>
                <Link href={doc.url}>
                  <a>
                    <span>{doc.title}</span>
                  </a>
                </Link>
                <div className={style.subtitle}>{doc.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={style.user_articles}>
          <div>
            <h6>community articles</h6>
            <div>
              {articles.map((article) => (
                <div className={style.user_article} key={article.id}>
                  <Link href={`/article/${article.slug}`}>
                    <a>
                      <span className={style.title}>{article.title}</span>
                    </a>
                  </Link>
                  <div className={style.subtitle}>
                    <span className={style.written}>Written by</span>
                    {article.author && (
                      <UserBadge user={article.author} displayAvatar={false} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
