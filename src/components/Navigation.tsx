import Link from 'next/link'
import style from './Navigation.module.scss'
import text from '../styles/Text.module.css'
import effects from '../styles/Effects.module.scss'
import cs from 'classnames'
import { Button } from './Button'
import { useContext } from 'react'
import { UserContext } from '../containers/UserProvider'
import { Dropdown } from './Navigation/Dropdown'
import { Avatar } from './User/Avatar'
import { getUserProfileLink } from '../utils/user'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export function Navigation() {
  const userCtx = useContext(UserContext)
  const router = useRouter()
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    setOpened(false)
  }, [router.pathname])

  console.log(router.pathname)

  return (
    <nav className={cs(style.nav, text.h6, { [style.opened]: opened })}>
      <button className={cs(style.hamburger)} onClick={() => setOpened(!opened)}>
        <div/><div/><div/>
      </button>

      <div className={cs(style.content)}>
        <Link href="/explore">
          <a className={cs({ [style.active]: router.pathname === "/explore" })}>explore</a>
        </Link>
        <Link href="/marketplace">
          <a className={cs({ [style.active]: router.pathname === "/marketplace" })}>marketplace</a>
        </Link>
        <Link href="/sandbox">
          <a className={cs({ [style.active]: router.pathname === "/sandbox" })}>sandbox</a>
        </Link>

        <Dropdown
          itemComp={<span>about</span>}
        >
          <Link href="/about">
            <a>about fxhash</a>
          </Link>
          <Link href="/articles/guide-mint-generative-token">
            <a>guide to mint Generative Token</a>
          </Link>
        </Dropdown>

        {userCtx.user ? (
          <Dropdown
            itemComp={<Avatar uri={userCtx.user.avatarUri} className={cs(style.avatar, effects['drop-shadow-big'])} />}
          >
            <Link href="/mint-generative">
              <a>mint generative token</a>
            </Link>
            <Link href={`${getUserProfileLink(userCtx.user)}`}>
              <a>creations</a>
            </Link>
            <Link href={`${getUserProfileLink(userCtx.user)}/collection`}>
              <a>collection</a>
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
  )
}