import style from "./UserBadge.module.scss"
import cs from "classnames"
import Link from "next/link"
import { User } from "../../types/entities/User"
import {
  getUserName,
  getUserProfileLink,
  isDonator,
  isPlatformOwned,
  isUserVerified,
  userAliases,
} from "../../utils/user"
import { Avatar } from "./Avatar"
import { IProps as IEntityBadgeProps } from "./EntityBadge"
import { ReactNode, useMemo } from "react"

export interface Props extends IEntityBadgeProps {}

interface WrapperProps {
  className: string
  user: User
  newTab?: boolean
  children: ReactNode
  isInline?: boolean
  avatarSide?: "left" | "right" | "top"
}

const WrapperLink = ({
  className,
  user,
  newTab,
  children,
  isInline,
  avatarSide,
}: WrapperProps) => {
  const Container = isInline ? "span" : "div"
  return (
    <Link href={getUserProfileLink(user)}>
      <a
        className={cs(style.link, style.default_font_styles, className)}
        target={newTab ? "_blank" : "_self"}
      >
        <Container className={cs(style.container, style[`side-${avatarSide}`])}>
          {children}
        </Container>
      </a>
    </Link>
  )
}

const WrapperDiv = ({
  className,
  user,
  children,
  isInline,
  avatarSide,
}: WrapperProps) => {
  const Container = isInline ? "span" : "div"
  return (
    <Container
      className={cs(
        className,
        style.default_font_styles,
        style.container,
        style[`side-${avatarSide}`]
      )}
    >
      {children}
    </Container>
  )
}

export function UserBadge({
  user,
  topText,
  prependText,
  size = "regular",
  hasLink = true,
  hasVerified = true,
  avatarSide = "left",
  displayAddress = false,
  displayAvatar = true,
  newTab = false,
  className,
  classNameAvatar,
  isInline = false,
}: Props) {
  // the user goes through an aliases check
  const userAlias = useMemo(() => user && userAliases(user), [user])
  const verified = user && hasVerified && isUserVerified(user)
  // alias can force no link
  hasLink = user && hasLink && !userAlias.preventLink
  // the wrapper component, either a link or a div
  const Wrapper = hasLink ? WrapperLink : WrapperDiv

  const Container = isInline ? "span" : "div"
  return user ? (
    <Wrapper
      className={cs(
        {
          [style.no_avatar]: !displayAvatar,
        },
        style[`container_size_${size}`],
        className
      )}
      isInline={isInline}
      user={userAlias}
      newTab={newTab}
      avatarSide={avatarSide}
    >
      {displayAvatar && (
        <Avatar
          image={user.avatarMedia}
          uri={userAlias.avatarUri}
          isInline={isInline}
          className={cs(
            style.avatar,
            style[`avatar-${size}`],
            {
              [style.avatar_mod]: isPlatformOwned(userAlias),
              [style.avatar_donation]: isDonator(userAlias),
            },
            classNameAvatar
          )}
        />
      )}

      <Container className={cs(style.user_infos)}>
        {topText && <span className={cs(style.user_address)}>{topText}</span>}
        <span className={cs(style.user_name)}>
          {prependText && (
            <span className={cs(style.prepend)}>{prependText}</span>
          )}
          <span
            className={cs({
              [style.moderator]: isPlatformOwned(userAlias),
              [style.donation]: isDonator(userAlias),
            })}
          >
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
          <span className={cs(style.user_address)}>{userAlias.id}</span>
        )}
      </Container>
    </Wrapper>
  ) : (
    <></>
  )
}
