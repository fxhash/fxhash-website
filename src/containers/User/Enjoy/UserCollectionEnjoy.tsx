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
  const { data, loading } = useQuery(Qu_userEntireCollection, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
    }
  })

  const entireCollection: Objkt[]|null = data?.user.entireCollection || null

  return (
    <GenerativeEnjoy
      tokens={entireCollection || []}
      backLink={`${getUserProfileLink(user)}/collection`}
      loading={loading}
    />
  )
}
