import style from "./SearchInput.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { FormEvent, useCallback, useMemo, useRef, useState } from "react"
import useClickOutside from "../../hooks/useClickOutside"
import useWindowSize, { breakpoints } from "../../hooks/useWindowsSize"

export interface SearchInputProps {
  placeholder?: string
  value: string
  className?: string
  classNameOpen?: string
  iconPosition?: "left" | "right"
  onChange: (value: string) => void
  onSearch: (value: string) => void
  onMinimize?: (state: boolean) => void
  minimize?: false | "desktop" | "mobile"
}

export function SearchInput({
  placeholder,
  value,
  onSearch,
  className,
  onChange,
  onMinimize,
  minimize = false,
  iconPosition = "left",
}: SearchInputProps) {
  const refInput = useRef<HTMLInputElement>(null)
  const refForm = useRef<HTMLFormElement>(null)
  const [isMinimized, setIsMinimized] = useState(!!minimize)
  const { width } = useWindowSize()
  const isMobile = useMemo(
    () => width !== undefined && width <= breakpoints.sm,
    [width]
  )
  const handleMinimize = useCallback(
    (newState) => {
      setIsMinimized(newState)
      onMinimize?.(newState)
    },
    [onMinimize]
  )
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (minimize === "desktop" || (isMobile && minimize === "mobile")) {
        handleMinimize(true)
      }
      onSearch(value)
    },
    [handleMinimize, isMobile, minimize, onSearch, value]
  )
  const handleToggleMinimize = useCallback(() => {
    if (minimize === "desktop" || (isMobile && minimize === "mobile")) {
      handleMinimize(!isMinimized)
    }
    setTimeout(() => {
      if (refInput.current && refInput.current.scrollWidth > 0) {
        refInput.current.focus()
      }
    }, 10)
  }, [handleMinimize, isMinimized, isMobile, minimize])

  useClickOutside(
    refForm,
    () => handleMinimize(true),
    !minimize ||
      (isMinimized &&
        ((isMobile && minimize === "mobile") || minimize === "desktop"))
  )
  return (
    <form
      ref={refForm}
      className={cs(style.search, effects["drop-shadow-small"], className, {
        [style["search--icon-right"]]: iconPosition === "right",
        [style["search--minimize"]]: isMinimized && minimize === "desktop",
        [style["search--minimize-mobile"]]:
          isMinimized && minimize === "mobile",
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
