import Link from 'next/link'
import style from './Navigation.module.scss'
import text from '../styles/Text.module.css'
import cs from 'classnames'
import { Button } from './Button'
import { useContext } from 'react'
import { UserContext } from '../containers/UserProvider'

export function Navigation() {
  const userCtx = useContext(UserContext)

  console.log(userCtx)

  return (
    <nav className={cs(style.nav, text.h6)}>
      <Link href="/explore">
        <a>explore</a>
      </Link>
      <Link href="/marketplace">
        <a>marketplace</a>
      </Link>
      <Link href="/sandbox">
        <a>sandbox</a>
      </Link>
      <Link href="/about">
        <a>about</a>
      </Link>

      <Button
        className="btn-sync"
        iconComp={<i aria-hidden className="fas fa-wallet"/>}
        onClick={() => {
          userCtx.connect()
        }}
      >
        sync
      </Button>
    </nav>
  )
}