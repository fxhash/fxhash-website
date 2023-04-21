import style from "./UserActions.module.scss"
import { useQuery } from "@apollo/client"
import cs from "classnames"
import { useState, useCallback } from "react"
import { Activity } from "../../components/Activity/Activity"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { Qu_userActions } from "../../queries/user"
import { User } from "../../types/entities/User"

const ITEMS_PER_PAGE = 20

interface Props {
  user: User
}
export function UserActions({ user }: Props) {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)

  const { data, loading, fetchMore } = useQuery<{ user: User | null }>(
    Qu_userActions,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        id: user.id,
        skip: 0,
        take: ITEMS_PER_PAGE,
      },
      onCompleted: (newData) => {
        if (
          !newData?.user?.actions?.length ||
          newData.user.actions.length < ITEMS_PER_PAGE
        ) {
          setHasNothingToFetch(true)
        }
      },
    }
  )

  // safe access to actions
  const actions = data?.user?.actions || null

  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        skip: actions?.length || 0,
        take: ITEMS_PER_PAGE,
      },
    })
    if (
      !newData?.user?.actions?.length ||
      newData.user.actions.length < ITEMS_PER_PAGE
    ) {
      setHasNothingToFetch(true)
    }
  }, [loading, hasNothingToFetch, fetchMore, actions?.length])

  return (
    <div className={cs(style.activity)}>
      <InfiniteScrollTrigger onTrigger={handleFetchMore} canTrigger={!loading}>
        {actions && (
          <Activity actions={actions} verbose={true} loading={loading} />
        )}
      </InfiniteScrollTrigger>
    </div>
  )
}
