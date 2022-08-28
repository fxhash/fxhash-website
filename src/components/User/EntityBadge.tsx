import { Collaboration, User, UserType } from "../../types/entities/User"
import { CollabBadge } from "./CollabBadge"
import { UserBadge } from "./UserBadge"

export interface IProps {
  user: User
  size?: "regular" | "big" | "small"
  prependText?: string
  hasLink?: boolean
  className?: string
  avatarSide?: "left" | "right"
  displayAddress?: boolean
  displayAvatar?: boolean
  toggeable?: boolean
  newTab?: boolean
  isInline?: boolean
}

/**
 * The EntityBadge can be used in places where we want a clean didplay of the
 * collaborators if the Entity is a collaboration instead of a contract
 * address.
 */
export function EntityBadge(props: IProps) {
  const { user } = props

  return user.type === UserType.COLLAB_CONTRACT_V1 ? (
    <CollabBadge {...props} user={props.user as Collaboration}/>
  ):(
    <UserBadge {...props}/>
  )
}
