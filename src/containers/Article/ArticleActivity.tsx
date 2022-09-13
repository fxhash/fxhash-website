import style from "./ArticleActivity.module.scss"
import { Activity } from "../../components/Activity/Activity"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { gql, useQuery } from "@apollo/client"
import { useRef, useEffect } from "react"
import { NFTArticle } from "../../types/entities/Article";
import { Frag_ArticleInfosAction } from "../../queries/fragments/article";

interface Props {
  article: NFTArticle
  filters?: any
}

const ITEMS_PER_PAGE = 20

const Qu_articleActions = gql`
  query Query ($id: Int!, $skip: Int, $take: Int, $filters: ActionFilter) {
    article(id: $id) {
      id
      actions(skip: $skip, take: $take, filters: $filters) {
        id
        type
        opHash
        numericValue
        metadata
        createdAt
        issuer {
          id
          name
          flag
          avatarUri
        }
        target {
          id
          name
          flag
          avatarUri
        }
        article {
          id
          ...ArticleInfosAction
        }
      }
    }
  }
  ${Frag_ArticleInfosAction}
`

export function ArticleActivity({
  article,
  filters,
}: Props) {
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore } = useQuery(Qu_articleActions, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: article.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
      filters
    }
  })

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === data.article?.actions?.length) {
        ended.current = true
      }
      else {
        currentLength.current = data.article?.actions?.length
      }
    }
  }, [data, loading])

  const load = () => {
    if (!ended.current) {
      fetchMore({
        variables: {
          id: article.id,
          skip: data?.article?.actions?.length || 0,
          take: ITEMS_PER_PAGE,
          filters
        }
      })
    }
  }

  const actions = data?.article?.actions || []

  return (
    <>
      <InfiniteScrollTrigger
        onTrigger={load}
        className={style.activity_wrapper}
        canTrigger={!loading}
      >
        <Activity actions={actions} className={style.activity_action} loading={loading} />
      </InfiniteScrollTrigger>
    </>
  )
}
