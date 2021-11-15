import style from "./GenerativeActions.module.scss"
import cs from "classnames"
import { Activity } from "../../components/Activity/Activity"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { Action } from "../../types/entities/Action"
import { gql, useQuery } from "@apollo/client"
import { useRef, useEffect } from "react"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"


interface Props {
  token: GenerativeToken
  initialActions: Action[]
  className: string
}

const ITEMS_PER_PAGE = 20

const Qu_genTokActions = gql`
  query Query ($id: Float!, $skip: Int, $take: Int) {
    generativeToken(id: $id) {
      id,
      actions(skip: $skip, take: $take) {
        id
        type
        metadata
        createdAt
        issuer {
          id
          name
          avatarUri
        }
        target {
          id
          name
          avatarUri
        }
        objkt {
          id
          name
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
  initialActions, 
  className
}: Props) {
  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore } = useQuery(Qu_genTokActions, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: token.id,
      skip: 0,
      take: initialActions.length
    }
  })

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === data.generativeToken?.actions?.length) {
        ended.current = true
      }
      else {
        currentLength.current = data.generativeTokens?.actions?.length
      }
    }
  }, [data, loading])

  const load = () => {
    if (!ended.current) {
      fetchMore({
        variables: {
          id: token.id,
          skip: data.generativeToken.actions.length,
          take: ITEMS_PER_PAGE
        }
      })
    }
  }

  const actions = data?.generativeToken?.actions || initialActions

  return (
    <>
      <InfiniteScrollTrigger
        onTrigger={load}
        className={style.activity_wrapper}
      >
        <Activity actions={actions} className={className} />
      </InfiniteScrollTrigger>

      {loading && data && <LoaderBlock/>}
    </>
  )
}