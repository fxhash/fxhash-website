import style from "./ArticleActivity.module.scss"
import { Activity } from "../../components/Activity/Activity"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { gql, useQuery } from "@apollo/client"
import { useState, useCallback } from "react"
import { NFTArticle } from "../../types/entities/Article"
import { Frag_ArticleInfosAction } from "../../queries/fragments/article"

interface Props {
  article: NFTArticle
  filters?: any
}

const ITEMS_PER_PAGE = 20

const Qu_articleActions = gql`
  query Query($id: Int!, $skip: Int, $take: Int, $filters: ActionFilter) {
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

export function ArticleActivity({ article, filters }: Props) {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)

  const { data, loading, fetchMore } = useQuery<{ article: NFTArticle }>(
    Qu_articleActions,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        id: article.id,
        skip: 0,
        take: ITEMS_PER_PAGE,
        filters,
      },
      onCompleted: (newData) => {
        if (
          !newData?.article.actions.length ||
          newData.article.actions.length < ITEMS_PER_PAGE
        ) {
          setHasNothingToFetch(true)
        }
      },
    }
  )

  const actions = data?.article?.actions || []
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        id: article.id,
        skip: actions.length || 0,
        take: ITEMS_PER_PAGE,
        filters,
      },
    })
    if (
      !newData?.article.actions.length ||
      newData.article.actions.length < ITEMS_PER_PAGE
    ) {
      setHasNothingToFetch(true)
    }
  }, [
    loading,
    hasNothingToFetch,
    fetchMore,
    article.id,
    actions.length,
    filters,
  ])

  return (
    <>
      <InfiniteScrollTrigger
        onTrigger={handleFetchMore}
        className={style.activity_wrapper}
        canTrigger={!loading && !hasNothingToFetch}
      >
        <Activity
          actions={actions}
          className={style.activity_action}
          loading={loading}
        />
      </InfiniteScrollTrigger>
    </>
  )
}
