import style from "./CollaborationsList.module.scss"
import cs from "classnames"
import colors from "../../styles/Colors.module.css"
import { useContext } from "react"
import { UserContext } from "../UserProvider"
import { useQuery } from "@apollo/client"
import { Qu_userCollaborations } from "../../queries/user"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { Collaboration, User } from "../../types/entities/User"
import { CollaborationCard } from "../../components/Collaborations/CollaborationCard"
import Link from "next/link"


interface Props {
  
}
export function CollaborationsList({
  
}: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!

  const { data, loading } = useQuery(Qu_userCollaborations, {
    fetchPolicy: "no-cache",
    variables: {
      id: user.id
    }
  })

  const collaborations: Collaboration[] = data?.user?.collaborationContracts

  return (
    <div className={cs(style.root)}>
      {loading ? (
        <LoaderBlock size="small" height="25vh" />
      ):(
        collaborations && collaborations.length > 0 ? (
          collaborations.map(collab => (
            <div className={cs(style.item)} key={collab.id}>
              <Link href={`/collaborations/${collab.id}`}>
                <a className={cs(style.item_link)}/>
              </Link>
              <CollaborationCard
                user={user as User}
                collaboration={collab}
              />
            </div>
          ))
        ):(
          <em className={cs(colors.gray)}>
            You are not part of any collaboration yet
          </em>
        )
      )}
    </div>
  )
}