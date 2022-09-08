import style from "./Articles.module.scss"
import layout from "../../../styles/Layout.module.scss"
import { useQuery } from "@apollo/client"
import cs from "classnames"
import { Qu_userArticlesOwned } from "../../../queries/user"
import { NTFArticleLedger } from "../../../types/entities/Article"
import { User } from "../../../types/entities/User"
import { CardNftArticle } from "../../../components/Card/CardNFTArticle"
import { CardNftArticleSkeleton } from "../../../components/Card/CardNFTArticleSkeleton"


interface Props {
  user: User  
}
export function UserCollectionArticles({
  user,
}: Props) {
  const { data, loading } = useQuery(Qu_userArticlesOwned, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
    },
  })

  // safe access to articles
  const articlesOwned: NTFArticleLedger[] = data?.user?.articlesOwned || null

  return (
    <div className={cs(style.container, layout['padding-big'])}>
      {articlesOwned?.map((owned, index) =>
        <CardNftArticle 
          key={owned.article.id}
          className={style.article} 
          article={owned.article}
          imagePriority={index < 4}
          editionsOwned={owned.amount}
        />
      )}
      {loading &&
        [...Array(20)].map((_, idx) =>
          <CardNftArticleSkeleton
            key={idx}
            className={style.article}
          />
        )
      }
    </div>
  )
}