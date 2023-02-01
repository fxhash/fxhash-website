import { Collaboration, User, UserType } from "../../types/entities/User"
import { CollabBadge } from "./CollabBadge"
import { UserBadge } from "./UserBadge"

export interface IProps {
  user: User
  size?: "small" | "regular" | "big" | "xl"
  prependText?: string
  topText?: string
  hasLink?: boolean
  hasVerified?: boolean
  className?: string
  avatarSide?: "left" | "right" | "top"
  classNameAvatar?: string
  displayAddress?: boolean
  displayAvatar?: boolean
  toggeable?: boolean
  newTab?: boolean
  isInline?: boolean
  centered?: boolean
}

/**
 * The EntityBadge can be used in places where we want a clean didplay of the
 * collaborators if the Entity is a collaboration instead of a contract
 * address.
 */
export function EntityBadge(props: IProps) {
  const { user } = props
  if (!user) return null
  return user.type === UserType.COLLAB_CONTRACT_V1 ? (
    <CollabBadge {...props} user={props.user as Collaboration} />
  ) : (
    <UserBadge {...props} />
  )
}
