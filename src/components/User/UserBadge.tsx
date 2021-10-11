import style from "./UserBadge.module.scss"
import cs from "classnames"
import Link from 'next/link'
import { User } from "../../types/entities/User"
import { getUserName, getUserProfileLink } from "../../utils/user"
import { Avatar } from "./Avatar"


interface Props {
  user: User
  size?: "regular" | "big"
  hasLink?: boolean
}

export function UserBadge({
  user,
  size = "regular",
  hasLink = true
}: Props) {
  return (
    hasLink ? (
      <Link href={getUserProfileLink(user)}>
        <a className={cs(style.container)}>
          <Avatar uri={user.avatarUri} className={cs(style.avatar, style[`avatar-${size}`])} />
          {getUserName(user, 15)}
        </a>
      </Link>
    ):(
      <div className={cs(style.container)}>
        <Avatar uri={user.avatarUri} className={cs(style.avatar, style[`avatar-${size}`])} />
        {getUserName(user, 15)}
      </div>
    )
  )
}