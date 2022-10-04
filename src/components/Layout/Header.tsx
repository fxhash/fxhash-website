import Link from "next/link"
import style from "./Header.module.scss"
import { Logo } from "../Logo/Logo"
import { Navigation } from "./Navigation"
import useWindowSize, { breakpoints } from "../../hooks/useWindowsSize"
import { useMemo, useState } from "react"
import cs from "classnames"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { width = 0 } = useWindowSize()
  const logoProps = useMemo<{
    width: number
    height: number
    fontSize: number
  }>(() => {
    if (width <= breakpoints.sm) {
      return {
        width: 143,
        height: 81,
        fontSize: 20,
      }
    }
    return { width: 213, height: 120, fontSize: 28 }
  }, [width])
  return (
    <header className={style.header}>
      <Link href="/">
        <a
          className={cs(style.logo, {
            [style["logo--hide"]]: isSearchOpen,
          })}
        >
          <Logo
            width={logoProps.width}
            height={logoProps.height}
            fontSize={logoProps.fontSize}
          />
          <span>FXHASH</span>
        </a>
      </Link>

      <Navigation onChangeSearchVisibility={setIsSearchOpen} />
    </header>
  )
}
