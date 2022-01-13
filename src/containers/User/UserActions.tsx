import style from "./UserActions.module.scss"
import { useQuery } from "@apollo/client"
import cs from "classnames"
import { useRef, useEffect } from "react"
import { Activity } from "../../components/Activity/Activity"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
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

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === data.user.actions?.length) {
        ended.current = true
      }
      else {
        currentLength.current = data.user.actions?.length
      }
    }
  }, [data, loading])

  const load = () => {
    if (!ended.current) {
      fetchMore({
        variables: {
          id: user.id,
          skip: data?.user.actions.length || 0,
          take: 20
        }
      })
    }
  }

  const actions: Action[]|null = data?.user.actions || null

  return (
    <>
      <InfiniteScrollTrigger
        onTrigger={load}
      >
        {actions && (
          <Activity actions={actions} className={cs(style.activity)} verbose={true} />
        )}
      </InfiniteScrollTrigger>

      {loading && data && <LoaderBlock height="100px"/>}
    </>
  )
}