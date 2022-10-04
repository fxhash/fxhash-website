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
import { getUserProfileLink } from "../../utils/user"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { SettingsModal } from "../../containers/Settings/SettingsModal"
import { SearchInputControlled } from "../Input/SearchInputControlled"

interface NavigationProps {
  onChangeSearchVisibility: (isVisible: boolean) => void
}
export function Navigation({ onChangeSearchVisibility }: NavigationProps) {
  const userCtx = useContext(UserContext)
  const router = useRouter()
  const [opened, setOpened] = useState(false)
  const [isSearchMinimized, setIsSearchMinimized] = useState(true)
  const [settingsModal, setSettingsModal] = useState<boolean>(false)

  const handleMinimize = useCallback(
    (isMinimized) => {
      setIsSearchMinimized(isMinimized)
      onChangeSearchVisibility(!isMinimized)
    },
    [onChangeSearchVisibility]
  )
  const handleSearch = useCallback(
    (search) => {
      router.push(`/search?query=${encodeURIComponent(search)}`)
    },
    [router]
  )
  const routerRoot = useMemo<string>(() => {
    return router.pathname.split("/")[1]
  }, [router.pathname])

  useEffect(() => {
    setOpened(false)
  }, [router.asPath])

  return (
    <>
      <nav className={cs(style.nav, text.h6, { [style.opened]: opened })}>
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
            <Link href="/explore">
              <a
                className={cs(style.nav_button, {
                  [style.active]: routerRoot === "explore",
                })}
              >
                explore
              </a>
            </Link>

            <Dropdown
              itemComp={<span>community</span>}
              btnClassName={cs(style.nav_button, {
                [style.active]: routerRoot === "community",
              })}
            >
              <Link href="/community/opening-schedule">
                <a className={style.nav_button}>opening schedule</a>
              </Link>
              <Link href="/community/reports">
                <a className={style.nav_button}>tokens reported</a>
              </Link>
              <Link href="https://feedback.fxhash.xyz/">
                <a className={style.nav_button} target="_blank">
                  feedback
                </a>
              </Link>
            </Dropdown>

            <Link href="/marketplace">
              <a
                className={cs(style.nav_button, {
                  [style.active]: routerRoot === "marketplace",
                })}
              >
                marketplace
              </a>
            </Link>
            <Link href="/sandbox">
              <a
                className={cs(style.nav_button, {
                  [style.active]: routerRoot === "sandbox",
                })}
              >
                sandbox
              </a>
            </Link>
            <Link href="/doc">
              <a
                className={cs(style.nav_button, {
                  [style.active]: routerRoot === "doc",
                })}
              >
                doc
              </a>
            </Link>
          </div>

          <button
            aria-label="Open settings modal"
            onClick={() => setSettingsModal(!settingsModal)}
            className={cs(style.nav_button, style.btn_icon)}
          >
            <i aria-hidden className="fas fa-cog" />
          </button>

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

          {userCtx.user ? (
            <Dropdown
              ariaLabel="Open user actions"
              itemComp={
                <div className={cs(style.avatar_btn)}>
                  <Avatar
                    uri={userCtx.user.avatarUri}
                    className={cs(style.avatar, effects["drop-shadow-big"])}
                  />
                  <i aria-hidden className="fas fa-caret-down" />
                </div>
              }
            >
              <Link href="/mint-generative">
                <a className={style.nav_button}>mint generative token</a>
              </Link>
              <Link href={`${getUserProfileLink(userCtx.user)}`}>
                <a className={style.nav_button}>creations</a>
              </Link>
              <Link href={`${getUserProfileLink(userCtx.user)}/articles`}>
                <a className={style.nav_button}>articles</a>
              </Link>
              <Link href={`${getUserProfileLink(userCtx.user)}/collection`}>
                <a className={style.nav_button}>collection</a>
              </Link>
              <Link href={`${getUserProfileLink(userCtx.user)}/dashboard`}>
                <a className={style.nav_button}>dashboard</a>
              </Link>
              <Link href={`/collaborations`}>
                <a className={style.nav_button}>collaborations</a>
              </Link>
              <Link href="/edit-profile">
                <a className={style.nav_button}>edit profile</a>
              </Link>
              <Button
                size="small"
                color="primary"
                onClick={() => userCtx.disconnect()}
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
              onClick={() => {
                userCtx.connect()
              }}
            >
              sync
            </Button>
          )}
        </div>
      </nav>

      {settingsModal && (
        <SettingsModal onClose={() => setSettingsModal(false)} />
      )}
    </>
  )
}
