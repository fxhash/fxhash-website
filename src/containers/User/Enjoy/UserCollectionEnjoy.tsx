import style from "./UserCollectionEnjoy.module.scss"
import cs from "classnames"
import { User } from "../../../types/entities/User"
import { useEffect, useRef } from "react"
import { useQuery } from "@apollo/client"
import { Qu_userEntireCollection } from "../../../queries/user"
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

  const { data, loading, fetchMore } = useQuery(Qu_userEntireCollection, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
    }
  })

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === data.user.entireCollection?.length) {
        ended.current = true
      }
      else {
        currentLength.current = data.user.entireCollection?.length
      }
    }
  }, [data, loading])

  const load = () => {
    if (!ended.current) {
      fetchMore({
        variables: {
          id: user.id,
        }
      })
    }
  }

  const entireCollection: Objkt[]|null = data?.user.entireCollection || null

  return (
    <GenerativeEnjoy
      tokens={entireCollection || []}
      backLink={`${getUserProfileLink(user)}/collection`}
      requestData={load}
    />
  )
}
