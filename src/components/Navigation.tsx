import Link from 'next/link'
import style from './Navigation.module.scss'
import text from '../styles/Text.module.css'
import effects from '../styles/Effects.module.scss'
import cs from 'classnames'
import { Button } from './Button'
import { useContext, useMemo } from 'react'
import { UserContext } from '../containers/UserProvider'
import { Dropdown } from './Navigation/Dropdown'
import { Avatar } from './User/Avatar'
import { getUserProfileLink } from '../utils/user'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { SettingsModal } from '../containers/Settings/SettingsModal'

export function Navigation() {
  const userCtx = useContext(UserContext)
  const router = useRouter()
  const [opened, setOpened] = useState(false)
  const [settingsModal, setSettingsModal] = useState<boolean>(false)

  const routerRoot = useMemo<string>(() => {
    return router.pathname.split("/")[1]
  }, [router.pathname])

  useEffect(() => {
    setOpened(false)
  }, [router.asPath])

  return (
    <>
      <nav className={cs(style.nav, text.h6, { [style.opened]: opened })}>
        <button className={cs(style.hamburger)} onClick={() => setOpened(!opened)}>
          <div/><div/><div/>
        </button>

        <div className={cs(style.content)}>
          <Link href="/explore">
            <a className={cs({ [style.active]: routerRoot === "explore" })}>explore</a>
          </Link>

          <Dropdown
            itemComp={<span>community</span>}
            btnClassName={cs({ [style.active]: routerRoot === "community" })}
          >
            <Link href="/community/opening-schedule">
              <a>opening schedule</a>
            </Link>
            <Link href="/community/reports">
              <a>tokens reported</a>
            </Link>
            <Link href="https://feedback.fxhash.xyz/">
              <a target="_blank">feedback</a>
            </Link>
          </Dropdown>

          <Link href="/marketplace">
            <a className={cs({ [style.active]: routerRoot === "marketplace" })}>marketplace</a>
          </Link>
          <Link href="/sandbox">
            <a className={cs({ [style.active]: routerRoot === "sandbox" })}>sandbox</a>
          </Link>
          <Link href="/doc">
            <a className={cs({ [style.active]: routerRoot === "doc" })}>doc</a>
          </Link>

          <button
            aria-label="Open settings modal"
            onClick={() => setSettingsModal(!settingsModal)}
            className={cs(style.btn_icon)}
          >
            <i
              aria-hidden
              className="fas fa-cog"
            />
          </button>

          {userCtx.user ? (
            <Dropdown
              ariaLabel="Open user actions"
              itemComp={(
                <div className={cs(style.avatar_btn)}>
                  <Avatar uri={userCtx.user.avatarUri} className={cs(style.avatar, effects['drop-shadow-big'])} />
                  <i aria-hidden className="fas fa-caret-down"/>
                </div>
              )}
            >
              <Link href="/mint-generative">
                <a>mint generative token</a>
              </Link>
              <Link href={`${getUserProfileLink(userCtx.user)}`}>
                <a>creations</a>
              </Link>
              <Link href={`${getUserProfileLink(userCtx.user)}/articles`}>
                <a>articles</a>
              </Link>
              <Link href={`${getUserProfileLink(userCtx.user)}/collection`}>
                <a>collection</a>
              </Link>
              <Link href={`${getUserProfileLink(userCtx.user)}/dashboard`}>
                <a>dashboard</a>
              </Link>
              <Link href={`/collaborations`}>
                <a>collaborations</a>
              </Link>
              <Link href="/edit-profile">
                <a>edit profile</a>
              </Link>
              <Button
                size="small"
                color="primary"
                onClick={() => userCtx.disconnect()}
                style={{
                  marginTop: "5px"
                }}
              >
                unsync
              </Button>
            </Dropdown>
          ):(
            <Button
              className="btn-sync"
              iconComp={<i aria-hidden className="fas fa-wallet"/>}
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
        <SettingsModal
          onClose={() => setSettingsModal(false)}
        />
      )}
    </>
  )
}
