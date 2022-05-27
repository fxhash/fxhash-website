import style from "./UserActions.module.scss"
import { useQuery } from "@apollo/client"
import cs from "classnames"
import { useRef, useEffect } from "react"
import { Activity } from "../../components/Activity/Activity"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { Qu_userActions } from "../../queries/user"
import { Action } from "../../types/entities/Action"
import { User } from "../../types/entities/User"

interface Props {
  user: User
}
export function UserActions({
  user,
}: Props) {
  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore } = useQuery(Qu_userActions, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: 20
    }
  })

  // safe access to actions
  const actions: Action[] = data?.user?.actions || null

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === actions?.length) {
        ended.current = true
      }
      else {
        currentLength.current = actions?.length
      }
    }
  }, [data, loading])

  const load = () => {
    if (!ended.current) {
      fetchMore({
        variables: {
          id: user.id,
          skip: actions?.length || 0,
          take: 20
        }
      })
    }
  }

  return (
    <div
      className={cs(style.activity)}
    >
      <h5 className={cs(style.title)}>Activity</h5>
      <InfiniteScrollTrigger
        onTrigger={load}
        canTrigger={!loading}
      >
        {actions && (
          <Activity
            actions={actions}
            verbose={true}
            loading={loading}
          />
        )}
      </InfiniteScrollTrigger>
    </div>
  )
}
