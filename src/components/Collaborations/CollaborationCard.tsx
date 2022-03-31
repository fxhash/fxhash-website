import style from "./CollaborationCard.module.scss"
import cs from "classnames"
import { Collaboration, User } from "../../types/entities/User"
import { UserBadge } from "../User/UserBadge"
import { useMemo } from "react"
import { Spacing } from "../Layout/Spacing"
import { format } from "date-fns"
import Link from "next/link"

interface Props {
  user: User
  collaboration: Collaboration
}
export function CollaborationCard({
  user,
  collaboration,
}: Props) {
  // we put the artist viewving as first of the list
  const sortedCollaborators = useMemo<User[]>(() => {
    return [...collaboration.collaborators].sort(
      (a, b) => a.id === user.id ? -1 : 1
    )
  }, [collaboration.collaborators])

  return (
    <div className={cs(style.root)}>
      <div className={cs(style.users)}>
        {sortedCollaborators.map(user => (
          <UserBadge
            key={user.id}
            user={user}
          />
        ))}
      </div>
      <Spacing size="regular"/>
      <div className={cs(style.line)}>
        <strong>Address:</strong>
        <Link href={`https://tzkt.io/${collaboration.id}`}>
          <a className={cs(style.address)} target="_blank">
            <span>{collaboration.id}</span>
            <i aria-hidden className="fas fa-external-link-square"/>
          </a>
        </Link>
      </div>
      <div className={cs(style.line)}>
        <strong>Created on:</strong>
        <span>
          {format(new Date(collaboration.createdAt), "MMMM d, yyyy' at 'HH:mm")}
        </span>
      </div>
    </div>
  )
}