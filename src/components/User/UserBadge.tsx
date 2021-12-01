import style from "./UserBadge.module.scss"
import cs from "classnames"
import Link from 'next/link'
import { User } from "../../types/entities/User"
import { getUserName, getUserProfileLink, isAdmin, isModerator, userAliases } from "../../utils/user"
import { Avatar } from "./Avatar"


interface Props {
  user: User
  size?: "regular" | "big" | "small"
  prependText?: string
  hasLink?: boolean
  className?: string
  avatarSide?: "left" | "right"
}

export function UserBadge({
  user,
  prependText,
  size = "regular",
  hasLink = true,
  avatarSide = "left",
  className
}: Props) {
  // the user goes through an aliases check
  const userAlias = userAliases(user)

  return (
    hasLink ? (
      <Link href={getUserProfileLink(userAlias)}>
        <a className={cs(style.container, style[`side-${avatarSide}`], className)}>
          <Avatar 
            uri={userAlias.avatarUri}
            className={cs(style.avatar, style[`avatar-${size}`], { [style.avatar_mod]: isAdmin(userAlias) })}
          />
          <span>
            <span className={cs(style.prepend)}>{prependText} </span>
            <span className={cs({ [style.moderator]: isAdmin(userAlias) })}>{getUserName(userAlias, 15)}</span>
          </span>
        </a>
      </Link>
    ):(
      <div className={cs(style.container, style[`side-${avatarSide}`], className)}>
        <Avatar 
          uri={userAlias.avatarUri}
          className={cs(style.avatar, style[`avatar-${size}`], { [style.avatar_mod]: isAdmin(userAlias) })}
        />
        <span>
          <span className={cs(style.prepend)}>{prependText} </span>
          <span className={cs({ [style.moderator]: isAdmin(userAlias) })}>{getUserName(userAlias, 15)}</span>
        </span>
      </div>
    )
  )
}