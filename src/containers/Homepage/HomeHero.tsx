import React, { memo, useMemo, useState } from "react"
import style from "./HomeHero.module.scss"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import Link from "next/link"
import { RandomIterativeCycler } from "./RandomIterativeCycler"
import { ProgressText } from "../../components/ProgressText/ProgressText"
import colors from "../../styles/Colors.module.css"
import layout from "../../styles/Layout.module.scss"
import { ConnectWithUs } from "../../components/ConnectWithUs/ConnectWithUs"
import cs from "classnames"
import { NFTArticle } from "../../types/entities/Article"
import { UserBadge } from "../../components/User/UserBadge"

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

interface HomeHeroProps {
  randomGenerativeToken: GenerativeToken | null
  articles: NFTArticle[]
}
const _HomeHero = ({ randomGenerativeToken, articles }: HomeHeroProps) => {
  const [cursor, setCursor] = useState(0)
  const percent = useMemo(() => {
    const nbObjkts = randomGenerativeToken?.objkts.length || 0
    return Math.floor(((cursor + 1) * 100) / nbObjkts)
  }, [cursor, randomGenerativeToken?.objkts.length])
  return (
    <>
      <div className={style.container}>
        <div className={style.left}>
          <div className={style.text}>
            <h1>
              Art is <ProgressText percent={percent}>evolving</ProgressText>
            </h1>
            <div className={style.description}>
              The <span className={colors.blue}>tezos</span> platform for
              artists and collectors to live out their passion for{" "}
              <span className={colors.primary}>generative&nbsp;art</span>.
            </div>
            <div className={style.socials}>
              <ConnectWithUs />
            </div>
          </div>
        </div>
        <div className={style.right}>
          <div>
            {randomGenerativeToken && (
              <RandomIterativeCycler
                generativeToken={randomGenerativeToken}
                onChangeCursor={setCursor}
              />
            )}
          </div>
        </div>
      </div>
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
                        <UserBadge
                          user={article.author}
                          displayAvatar={false}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const HomeHero = memo(_HomeHero)
