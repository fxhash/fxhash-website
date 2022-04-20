import style from "./UserBadge.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import Link from 'next/link'
import { User } from "../../types/entities/User"
import { getUserName, getUserProfileLink, isPlatformOwned, isUserVerified, userAliases } from "../../utils/user"
import { Avatar } from "./Avatar"
import { IProps as IEntityBadgeProps } from "./EntityBadge"
import { FunctionComponent, ReactNode, useMemo } from "react"


export interface Props extends IEntityBadgeProps {
}

interface WrapperProps {
  className: string
  user: User
  children: ReactNode
}

const WrapperLink = ({
  className,
  user,
  children,
}: WrapperProps) => (
  <Link href={getUserProfileLink(user)}>
    <a className={className}>
      {children}
    </a>
  </Link>
)

const WrapperDiv = ({
  className,
  user,
  children,
}: WrapperProps) => (
  <div className={className}>
    {children}
  </div>
)

export function UserBadge({
  user,
  prependText,
  size = "regular",
  hasLink = true,
  avatarSide = "left",
  displayAddress = false,
  displayAvatar = true,
  className
}: Props) {
  // the user goes through an aliases check
  const userAlias = useMemo(() => user && userAliases(user), [user])
  const verified = user && isUserVerified(user)
  // alias can force no link
  hasLink = user && hasLink && !userAlias.preventLink
  // the wrapper component, either a link or a div
  const Wrapper = hasLink ? WrapperLink : WrapperDiv

  return user ? (
    <Wrapper
      className={cs(style.container, style[`side-${avatarSide}`], className)}
      user={userAlias}
    >
      {displayAvatar && (
        <Avatar
          uri={userAlias.avatarUri}
          className={cs(
            style.avatar,
            style[`avatar-${size}`],
            { [style.avatar_mod]: isPlatformOwned(userAlias) }
          )}
        />
      )}

      <div className={cs(style.user_infos)}>
        <span className={cs(style.user_name)}>
          {prependText && (
            <span className={cs(style.prepend)}>{prependText}</span>
          )}
          <span className={cs({ [style.moderator]: isPlatformOwned(userAlias) })}>
            {getUserName(userAlias, 15)}
          </span>
          {verified && (
            <i
              aria-hidden
              className={cs("fas", "fa-badge-check", style.verified)}
            />
          )}
        </span>

        {displayAddress && (
          <span className={cs(style.user_address)}>
            {userAlias.id}
          </span>
        )}
      </div>
    </Wrapper>
  ) : <></>
}