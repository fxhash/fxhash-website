import style from "./SearchInput.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { FormEvent, useCallback, useMemo, useRef, useState } from "react"
import useClickOutside from "../../hooks/useClickOutside"
import useWindowSize, { breakpoints } from "../../hooks/useWindowsSize"

interface Props {
  placeholder: string
  value: string
  className?: string
  onChange: (value: string) => void
  onSearch: (value: string) => void
  onMinimize?: (value: boolean) => void
  minimizeOnMobile?: boolean
}

export function SearchInput({
  placeholder,
  value,
  onSearch,
  className,
  onChange,
  onMinimize,
  minimizeOnMobile = false,
}: Props) {
  const refInput = useRef<HTMLInputElement>(null)
  const refForm = useRef<HTMLFormElement>(null)
  const [isMinimizedOnMobile, setIsMinimizedOnMobile] =
    useState(minimizeOnMobile)
  const { width } = useWindowSize()
  const isMobile = useMemo(
    () => width !== undefined && width <= breakpoints.sm,
    [width]
  )
  const handleMinimize = useCallback(
    (newState) => {
      setIsMinimizedOnMobile(newState)
      onMinimize?.(newState)
    },
    [onMinimize]
  )
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (isMobile && minimizeOnMobile) {
        handleMinimize(true)
      }
      onSearch(value)
    },
    [isMobile, minimizeOnMobile, onSearch, value]
  )
  const handleToggleMinimize = useCallback(() => {
    if (isMobile && minimizeOnMobile) {
      handleMinimize(!isMinimizedOnMobile)
    }
    if (refInput.current && refInput.current.scrollWidth > 0) {
      refInput.current.focus()
    }
  }, [handleMinimize, isMinimizedOnMobile, isMobile, minimizeOnMobile])
  useClickOutside(
    refForm,
    () => handleMinimize(true),
    !minimizeOnMobile || (minimizeOnMobile && isMobile && isMinimizedOnMobile)
  )
  return (
    <form
      ref={refForm}
      className={cs(style.search, effects["drop-shadow-small"], className, {
        [style["search--minimize"]]: isMinimizedOnMobile,
      })}
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className={cs(style["search-icon"])}
        aria-label="search"
        onClick={handleToggleMinimize}
      >
        <i className="fas fa-search" aria-hidden={true} />
      </button>
      <input
        ref={refInput}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </form>
  )
}
