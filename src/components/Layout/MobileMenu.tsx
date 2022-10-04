import React, { memo, useCallback, useMemo, useState } from "react"
import style from "./MobileMenu.module.scss"
import { NavigationLink, NavigationLinkSingle } from "./navigationLinks"
import cs from "classnames"
import { Dropdown } from "../Navigation/Dropdown"
import Link from "next/link"
import { useRouter } from "next/router"
import { DropdownList } from "../Navigation/DropdownList"
import { Button } from "../Button"
import { ConnectedUser } from "../../types/entities/User"
import { UserFromAddress } from "../User/UserFromAddress"
import { UserBadge } from "../User/UserBadge"
import ReactDOM from "react-dom"
import { MobileMenuUser } from "./MobileMenuUser"

interface MobileMenuProps {
  navigationLinks: NavigationLink[]
  profileLinks: NavigationLinkSingle[] | null
  onClickSettings: () => void
  onClickConnect: () => void
  onClickDisconnect: () => void
  user: ConnectedUser | null
}

const _MobileMenu = ({
  navigationLinks,
  profileLinks,
  onClickSettings,
  onClickConnect,
  onClickDisconnect,
  user,
}: MobileMenuProps) => {
  const [showProfile, setShowProfile] = useState(false)
  const router = useRouter()
  const routerRoot = useMemo<string>(() => {
    return router.pathname.split("/")[1]
  }, [router.pathname])
  const handleClickShowProfile = useCallback(
    (newState) => () => setShowProfile(newState),
    []
  )
  return ReactDOM.createPortal(
    <div className={style.container}>
      <div className={style.links}>
        {navigationLinks.map((link) => {
          return "subMenu" in link ? (
            <Dropdown
              itemComp={<span>{link.label}</span>}
              btnClassName={cs(style.nav_button, {
                [style.active]: routerRoot === link.key,
              })}
              renderComp={DropdownList}
            >
              <div className={style.submenu}>
                {link.subMenu.map((linkSubmenu) => (
                  <Link key={linkSubmenu.key} href={linkSubmenu.href}>
                    <a
                      className={style.nav_button}
                      target={linkSubmenu.external ? "_blank" : undefined}
                    >
                      {linkSubmenu.label}
                    </a>
                  </Link>
                ))}
              </div>
            </Dropdown>
          ) : (
            <Link href={link.href}>
              <a
                className={cs(style.nav_button, {
                  [style.active]: routerRoot === link.key,
                })}
              >
                {link.label}
              </a>
            </Link>
          )
        })}
        <div className={style.nav_button}>
          <button
            aria-label="Open settings modal"
            onClick={onClickSettings}
            className={cs(style.btn_icon)}
          >
            <i aria-hidden className="fas fa-cog" />
          </button>
        </div>
      </div>
      <hr />
      {user ? (
        <button
          type="button"
          className={cs(style.avatar_btn)}
          onClick={handleClickShowProfile(true)}
        >
          <UserFromAddress address={user.id}>
            {({ user: fetchedUser }) => (
              <UserBadge user={fetchedUser} hasLink={false} size="big" />
            )}
          </UserFromAddress>
          <i aria-hidden className="fas fa-caret-up" />
        </button>
      ) : (
        <Button
          className="btn-sync"
          iconComp={<i aria-hidden className="fas fa-wallet" />}
          onClick={onClickConnect}
        >
          sync
        </Button>
      )}
      {user && profileLinks && (
        <MobileMenuUser
          user={user}
          open={showProfile}
          links={profileLinks}
          onClose={handleClickShowProfile(false)}
          onClickDisconnect={onClickDisconnect}
        />
      )}
    </div>,
    document.body
  )
}

export const MobileMenu = memo(_MobileMenu)
