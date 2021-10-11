import Image from 'next/image'
import Link from 'next/link'
import style from './Header.module.scss'
import { Navigation } from './Navigation'

export function Header() {
  return (
    <header className={style.header}>
      <Link href="/">
        <a className={style.logo}>
          <Image
            src="/images/logo.svg"
            width={88}
            height={78}
            alt="FXHASH"
          />
          <h1>fxhash</h1>
        </a>
      </Link>
      
      <Navigation />
    </header>
  )
}