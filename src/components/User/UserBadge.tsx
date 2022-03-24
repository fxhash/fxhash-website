import style from "./UserBadge.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import Link from 'next/link'
import { User } from "../../types/entities/User"
import { getUserName, getUserProfileLink, isPlatformOwned, isUserVerified, userAliases } from "../../utils/user"
import { Avatar } from "./Avatar"


interface Props {
  user: User
  size?: "regular" | "big" | "small"
  prependText?: string
  hasLink?: boolean
  className?: string
  avatarSide?: "left" | "right"
  displayAddress?: boolean
}

export function UserBadge({
  user,
  prependText,
  size = "regular",
  hasLink = true,
  avatarSide = "left",
  displayAddress = false,
  className
}: Props) {
  // the user goes through an aliases check
  const userAlias = userAliases(user)
  const verified = isUserVerified(user)

  return (
    hasLink ? (
      <Link href={getUserProfileLink(userAlias)}>
        <a className={cs(style.container, style[`side-${avatarSide}`], className)}>
          <Avatar 
            uri={userAlias.avatarUri}
            className={cs(style.avatar, style[`avatar-${size}`], { [style.avatar_mod]: isPlatformOwned(userAlias) })}
          />
          <div className={cs(style.user_infos)}>
            <span className={cs(style.user_name)}>
              {prependText && <span className={cs(style.prepend)}>{prependText}</span>}
              <span className={cs({ [style.moderator]: isPlatformOwned(userAlias) })}>{getUserName(userAlias, 15)}</span>
              {verified && <i aria-hidden className={cs("fas", "fa-badge-check", style.verified)}/>}
            </span>
            {displayAddress && (
              <span className={cs(style.user_address)}>
                {user.id}
              </span>
            )}
          </div>
        </a>
      </Link>
    ):(
      <div className={cs(style.container, style[`side-${avatarSide}`], className)}>
        <Avatar 
          uri={userAlias.avatarUri}
          className={cs(style.avatar, style[`avatar-${size}`], { [style.avatar_mod]: isPlatformOwned(userAlias) })}
        />
        <div className={cs(style.user_infos)}>
          <span className={cs(style.user_name)}>
            {prependText && <span className={cs(style.prepend)}>{prependText}</span>}
            <span className={cs({ [style.moderator]: isPlatformOwned(userAlias) })}>{getUserName(userAlias, 15)}</span>
            {verified && <i aria-hidden className={cs("fas", "fa-badge-check", style.verified)}/>}
          </span>
          {displayAddress && (
            <span className={cs(style.user_address)}>
              {user.id}
            </span>
          )}
        </div>
      </div>
    )
  )
}