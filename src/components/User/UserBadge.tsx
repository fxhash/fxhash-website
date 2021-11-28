import style from "./UserBadge.module.scss"
import cs from "classnames"
import Link from 'next/link'
import { User } from "../../types/entities/User"
import { getUserName, getUserProfileLink } from "../../utils/user"
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
  return (
    hasLink ? (
      <Link href={getUserProfileLink(user)}>
        <a className={cs(style.container, style[`side-${avatarSide}`], className)}>
          <Avatar uri={user.avatarUri} className={cs(style.avatar, style[`avatar-${size}`])} />
          <span><span className={cs(style.prepend)}>{prependText}</span> {getUserName(user, 15)}</span>
        </a>
      </Link>
    ):(
      <div className={cs(style.container, style[`side-${avatarSide}`], className)}>
        <Avatar uri={user.avatarUri} className={cs(style.avatar, style[`avatar-${size}`])} />
        <span><span className={cs(style.prepend)}>{prependText}</span> {getUserName(user, 15)}</span>
      </div>
    )
  )
}