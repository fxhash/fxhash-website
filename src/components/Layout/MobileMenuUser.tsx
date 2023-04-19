import React, { memo, useCallback } from "react"
import style from "./MobileMenuUser.module.scss"
import { NavigationLink, NavigationLinkSingle } from "./navigationLinks"
import ReactDOM from "react-dom"
import cs from "classnames"
import { UserFromAddress } from "../User/UserFromAddress"
import { UserBadge } from "../User/UserBadge"
import { ConnectedUser } from "../../types/entities/User"
import Link from "next/link"
import { Button } from "../Button"

interface MobileMenuUserProps {
  open: boolean
  links: NavigationLink[]
  onClose: () => void
  user: ConnectedUser
  onClickDisconnect: () => void
}

const _MobileMenuUser = ({
  open,
  user,
  onClose,
  links,
  onClickDisconnect,
}: MobileMenuUserProps) => {
  const renderProfileLink = useCallback(
    (profileLink, isTitle) => {
      return (
        <Link key={profileLink.key} href={profileLink.href}>
          <a
            className={cs(style.nav_button, {
              [style.button_title]: isTitle,
            })}
            onClick={onClose}
          >
            {profileLink.label}
          </a>
        </Link>
      )
    },
    [onClose]
  )

  return ReactDOM.createPortal(
    <div
      className={cs(style.container, { [style["container--open"]]: open })}
      onClick={onClose}
    >
      <div className={style.menu} onClick={(ev) => ev.stopPropagation()}>
        <button
          type="button"
          className={cs(style.avatar_btn)}
          onClick={onClose}
        >
          <UserFromAddress address={user.id}>
            {({ user: fetchedUser }) => (
              <UserBadge user={fetchedUser} hasLink={false} size="big" />
            )}
          </UserFromAddress>
          <i aria-hidden className="fas fa-caret-down" />
        </button>
        <div className={style.links}>
          {links.map((profileLink) => {
            return "subMenu" in profileLink ? (
              <>
                <div className={style.divider} />
                {renderProfileLink(profileLink, true)}
                {profileLink.subMenu.map((link) =>
                  renderProfileLink(link, false)
                )}
              </>
            ) : (
              renderProfileLink(profileLink, false)
            )
          })}
        </div>
        <Button
          className={style.button_unsync}
          type="button"
          size="small"
          color="primary"
          onClick={onClickDisconnect}
        >
          unsync
        </Button>
      </div>
    </div>,
    document.body
  )
}

export const MobileMenuUser = memo(_MobileMenuUser)
