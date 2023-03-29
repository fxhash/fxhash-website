import style from "./Articles.module.scss"
import layout from "../../../styles/Layout.module.scss"
import { useQuery } from "@apollo/client"
import cs from "classnames"
import { Qu_userArticlesOwned } from "../../../queries/user"
import { NTFArticleLedger } from "../../../types/entities/Article"
import { User } from "../../../types/entities/User"
import { CardNftArticle } from "../../../components/Card/CardNFTArticle"
import { CardNftArticleSkeleton } from "../../../components/Card/CardNFTArticleSkeleton"
import React from "react"
import { Select } from "components/Input/Select"
import { useQueryParamSort } from "hooks/useQueryParamSort"
import searchStyle from "components/Search/Search.module.scss"

const sortOptionsUserArticles = [
  {
    label: "recently collected",
    value: "collected-desc",
  },
  {
    label: "oldest collected",
    value: "collected-asc",
  },
]

interface Props {
  user: User
}

export function UserCollectionArticles({ user }: Props) {
  const { sortValue, sortOptions, setSortValue } = useQueryParamSort(
    sortOptionsUserArticles,
    {
      defaultSort: "collected-desc",
    }
  )

  const { data, loading } = useQuery(Qu_userArticlesOwned, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
    },
  })

  // safe access to articles
  const articlesOwned: NTFArticleLedger[] | null = (() => {
    if (!data?.user) return null
    const articlesOwned = [...data.user.articlesOwned]
    if (sortValue === "collected-asc") return articlesOwned
    return articlesOwned.reverse()
  })()

  return (
    <div className={cs(style.container, layout["padding-big"])}>
      <div className={cs(searchStyle.search_header, style.header)}>
        <Select
          value={sortValue}
          options={sortOptions}
          onChange={setSortValue}
        />
      </div>

      {!loading && !articlesOwned?.length && <div>No articles</div>}

      {articlesOwned?.map((owned, index) => (
        <CardNftArticle
          key={owned.article.id}
          className={style.article}
          article={owned.article}
          imagePriority={index < 4}
          editionsOwned={owned.amount}
        />
      ))}
      {loading &&
        [...Array(20)].map((_, idx) => (
          <CardNftArticleSkeleton key={idx} className={style.article} />
        ))}
    </div>
  )
}
