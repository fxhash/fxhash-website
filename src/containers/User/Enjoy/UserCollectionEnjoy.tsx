import style from "./UserCollectionEnjoy.module.scss"
import cs from "classnames"
import { User } from "../../../types/entities/User"
import { useEffect, useRef } from "react"
import { useQuery } from "@apollo/client"
import { Qu_userObjkts } from "../../../queries/user"
import { Objkt } from "../../../types/entities/Objkt"
import { GenerativeEnjoy } from "../../Generative/Enjoy/GenerativeEnjoy"
import { getUserProfileLink } from "../../../utils/user"

interface Props {
  user: User
}
export function UserCollectionEnjoy({
  user
}: Props) {
  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore } = useQuery(Qu_userObjkts, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: 5
    }
  })

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === data.user.objkts?.length) {
        ended.current = true
      }
      else {
        currentLength.current = data.user.objkts?.length
      }
    }
  }, [data, loading])

  const load = () => {
    console.log("load more")
    if (!ended.current) {
      fetchMore({
        variables: {
          id: user.id,
          skip: data?.user.objkts.length || 0,
          take: 5
        }
      })
    }
  }

  const objkts: Objkt[]|null = data?.user.objkts || null

  return (
    <GenerativeEnjoy
      tokens={objkts || []}
      backLink={`${getUserProfileLink(user)}/collection`}
      requestData={load}
    />
  )
}