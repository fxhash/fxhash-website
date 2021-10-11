import Link from 'next/link'
import style from './Navigation.module.scss'
import text from '../styles/Text.module.css'
import cs from 'classnames'
import { Button } from './Button'

export function Navigation() {
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
      >
        sync
      </Button>
    </nav>
  )
}