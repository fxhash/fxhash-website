import Link from "next/link"
import style from "./Navigation.module.scss"
import text from "../../styles/Text.module.css"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { Button } from "../Button"
import { useCallback, useContext, useMemo } from "react"
import { UserContext } from "../../containers/UserProvider"
import { Dropdown } from "../Navigation/Dropdown"
import { Avatar } from "../User/Avatar"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { SettingsModal } from "../../containers/Settings/SettingsModal"
import { SearchInputControlled } from "../Input/SearchInputControlled"
import { getProfileLinks, navigationLinks } from "./navigationLinks"
import { MobileMenu } from "./MobileMenu"
import ClientOnly from "../Utils/ClientOnly"
import useWindowSize, { breakpoints } from "../../hooks/useWindowsSize"

interface NavigationProps {
  onChangeSearchVisibility: (isVisible: boolean) => void
}
export function Navigation({ onChangeSearchVisibility }: NavigationProps) {
  const userCtx = useContext(UserContext)
  const router = useRouter()
  const [opened, setOpened] = useState(false)
  const [isSearchMinimized, setIsSearchMinimized] = useState(true)
  const [settingsModal, setSettingsModal] = useState<boolean>(false)
  const { width } = useWindowSize()

  const handleMinimize = useCallback(
    (isMinimized) => {
      setIsSearchMinimized(isMinimized)
      onChangeSearchVisibility(!isMinimized)
    },
    [onChangeSearchVisibility]
  )
  const handleSearch = useCallback(
    (search) => {
      const isSamePath = router.pathname.startsWith("/search")
      router
        .push({
          pathname: "/search",
          query: { query: encodeURIComponent(search) },
        })
        .then(() => {
          if (isSamePath) {
            window.location.reload()
          }
        })
    },
    [router]
  )
  const handleClickConnect = useCallback(() => {
    userCtx.connect()
  }, [userCtx])
  const handleClickDisconnect = useCallback(() => {
    userCtx.disconnect()
  }, [userCtx])
  const routerRoot = useMemo<string>(() => {
    return router.pathname.split("/")[1]
  }, [router.pathname])

  useEffect(() => {
    setOpened(false)
  }, [router.asPath])

  const profileLinks = useMemo(
    () => userCtx?.user && getProfileLinks(userCtx.user),
    [userCtx.user]
  )

  const isMobile = useMemo(
    () => width !== undefined && width <= breakpoints.sm,
    [width]
  )
  return (
    <>
      <nav className={cs(style.nav, text.h6, { [style.opened]: opened })}>
        {isMobile && (
          <SearchInputControlled
            iconPosition="right"
            className={cs(style.search_mobile, {
              [style["search_mobile--open"]]: !isSearchMinimized,
            })}
            placeholder="Search users, gentk, articles..."
            onSearch={handleSearch}
            onMinimize={handleMinimize}
            minimize={isSearchMinimized}
            minimizeBehavior="desktop"
          />
        )}
        <button
          className={cs(style.hamburger)}
          onClick={() => setOpened(!opened)}
        >
          <div />
          <div />
          <div />
        </button>

        <div className={cs(style.content)}>
          <div
            className={cs(style.links, {
              [style.links_minimized]: !isSearchMinimized,
            })}
          >
            {navigationLinks.map((link) => {
              return "subMenu" in link ? (
                <Dropdown
                  key={link.key}
                  itemComp={<span>{link.label}</span>}
                  btnClassName={cs(style.nav_button, {
                    [style.active]: routerRoot === link.key,
                  })}
                >
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
                </Dropdown>
              ) : (
                <Link key={link.key} href={link.href}>
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
          </div>

          <button
            aria-label="Open settings modal"
            onClick={() => setSettingsModal(!settingsModal)}
            className={cs(style.nav_button, style.btn_icon)}
          >
            <i aria-hidden className="fas fa-cog" />
          </button>

          {!isMobile && (
            <SearchInputControlled
              iconPosition="right"
              className={cs(style.search, {
                [style["search--open"]]: !isSearchMinimized,
              })}
              placeholder="Search users, gentk, articles..."
              onSearch={handleSearch}
              onMinimize={handleMinimize}
              minimize={isSearchMinimized}
              minimizeBehavior="desktop"
            />
          )}
          {userCtx.user && profileLinks ? (
            <Dropdown
              ariaLabel="Open user actions"
              itemComp={
                <div className={cs(style.avatar_btn)}>
                  <Avatar
                    image={userCtx.user.avatarMedia}
                    uri={userCtx.user.avatarUri}
                    className={cs(style.avatar, effects["drop-shadow-big"])}
                  />
                  <i aria-hidden className="fas fa-caret-down" />
                </div>
              }
            >
              {profileLinks.map((profileLink) => (
                <Link key={profileLink.key} href={profileLink.href}>
                  <a className={style.nav_button}>{profileLink.label}</a>
                </Link>
              ))}
              <Button
                size="small"
                color="primary"
                onClick={handleClickDisconnect}
                style={{
                  marginTop: "5px",
                }}
              >
                unsync
              </Button>
            </Dropdown>
          ) : (
            <Button
              className="btn-sync"
              iconComp={<i aria-hidden className="fas fa-wallet" />}
              onClick={handleClickConnect}
            >
              sync
            </Button>
          )}
        </div>
      </nav>
      <ClientOnly>
        <MobileMenu
          open={opened}
          onClickSettings={() => setSettingsModal(true)}
          navigationLinks={navigationLinks}
          profileLinks={profileLinks}
          onClickConnect={handleClickConnect}
          onClickDisconnect={handleClickDisconnect}
          user={userCtx.user}
        />
      </ClientOnly>
      {settingsModal && (
        <SettingsModal onClose={() => setSettingsModal(false)} />
      )}
    </>
  )
}
