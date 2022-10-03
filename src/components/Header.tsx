import Image from "next/image"
import Link from "next/link"
import style from "./Header.module.scss"
import { Logo } from "./Logo/Logo"
import { Navigation } from "./Navigation"

export function Header() {
  return (
    <header className={style.header}>
      <Link href="/">
        <a className={style.logo}>
          <Logo />
          <span>FXHASH</span>
        </a>
      </Link>

      <Navigation />
    </header>
  )
}
