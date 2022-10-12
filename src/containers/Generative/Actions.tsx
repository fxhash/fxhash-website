import style from "./GenerativeActions.module.scss"
import { Activity } from "../../components/Activity/Activity"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { gql, useQuery } from "@apollo/client"
import { useState, useCallback } from "react"
import { GenerativeToken } from "../../types/entities/GenerativeToken"

interface Props {
  token: GenerativeToken
  className?: string
  filters?: any
}

const ITEMS_PER_PAGE = 20

const Qu_genTokActions = gql`
  query Query ($id: Float!, $skip: Int, $take: Int, $filters: ActionFilter) {
    generativeToken(id: $id) {
      id,
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
        objkt {
          id
          name
          iteration
        }
        token {
          id
          name
        }
      }
    }
  }
`

export function GenerativeActions({
  token,
  className,
  filters,
}: Props) {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false);

  const { data, loading, fetchMore } = useQuery<{ generativeToken: GenerativeToken }>(Qu_genTokActions, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: token.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
      filters
    },
    onCompleted: (newData) => {
      if (!newData?.generativeToken?.actions?.length || newData.generativeToken?.actions?.length < ITEMS_PER_PAGE) {
        setHasNothingToFetch(true);
      }
    }
  })

  const actions = data?.generativeToken?.actions || []
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false;
    const { data: newData } = await fetchMore({
      variables: {
        skip: actions?.length || 0,
        take: ITEMS_PER_PAGE,
      },
    });
    if (!newData?.generativeToken?.actions?.length || newData.generativeToken?.actions?.length < ITEMS_PER_PAGE) {
      setHasNothingToFetch(true);
    }
  }, [loading, hasNothingToFetch, fetchMore, actions?.length])

  return (
    <>
      <InfiniteScrollTrigger
        onTrigger={handleFetchMore}
        className={style.activity_wrapper}
        canTrigger={!loading && !hasNothingToFetch}
      >
        <Activity actions={actions} className={className} loading={loading} />
      </InfiniteScrollTrigger>
    </>
  )
}
