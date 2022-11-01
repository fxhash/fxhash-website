import style from "./SearchInput.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import {
  FocusEventHandler,
  FormEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import useClickOutside from "../../hooks/useClickOutside"
import useWindowSize, { breakpoints } from "../../hooks/useWindowsSize"
import { focusAndOpenKeyboard } from "../../utils/events";

export interface SearchInputProps {
  placeholder?: string
  value: string
  className?: string
  classNameOpen?: string
  iconPosition?: "left" | "right"
  onChange: (value: string) => void
  onSearch: (value: string) => void
  onMinimize?: (state: boolean) => void
  minimize?: boolean
  minimizeBehavior?: false | "desktop" | "mobile"
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
}

export function SearchInput({
  placeholder,
  value,
  onSearch,
  className,
  onChange,
  onMinimize,
  minimize,
  minimizeBehavior = false,
  iconPosition = "left",
  onBlur,
  onFocus,
}: SearchInputProps) {
  const refInput = useRef<HTMLInputElement>(null)
  const refForm = useRef<HTMLFormElement>(null)
  const { width } = useWindowSize()
  const [isMinimizedControlled, setIsMinimizedControlled] = useState(
    !!minimizeBehavior
  )
  const isMinimized = useMemo(
    () => (minimize === undefined ? isMinimizedControlled : minimize),
    [isMinimizedControlled, minimize]
  )

  const isMobile = useMemo(
    () => width !== undefined && width <= breakpoints.sm,
    [width]
  )
  const handleMinimize = useCallback(
    (newState) => {
      setIsMinimizedControlled(newState)
      onMinimize?.(newState)
    },
    [onMinimize]
  )
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (
        minimizeBehavior === "desktop" ||
        (isMobile && minimizeBehavior === "mobile")
      ) {
        handleMinimize(true)
      }
      onSearch(value)
    },
    [handleMinimize, isMobile, minimizeBehavior, onSearch, value]
  )
  const handleToggleMinimize = useCallback(() => {
    let isMinimizedUpdated = isMinimized
    if (
      minimizeBehavior === "desktop" ||
      (isMobile && minimizeBehavior === "mobile")
    ) {
      isMinimizedUpdated = !isMinimized
      handleMinimize(isMinimizedUpdated)
    }
    if (refInput.current && !isMinimizedUpdated) {
      focusAndOpenKeyboard(refInput.current, 100)
    }
  }, [handleMinimize, isMinimized, isMobile, minimizeBehavior])

  useClickOutside(
    refForm,
    () => setTimeout(() => handleMinimize(true), 100),
    !minimizeBehavior ||
      (!isMobile && minimizeBehavior === "mobile") ||
      (isMinimized &&
        ((isMobile && minimizeBehavior === "mobile") ||
          minimizeBehavior === "desktop"))
  )

  return (
    <form
      ref={refForm}
      className={cs(style.search, effects["drop-shadow-small"], className, {
        [style["search--icon-right"]]: iconPosition === "right",
        [style["search--minimize"]]:
          isMinimized && minimizeBehavior === "desktop",
        [style["search--minimize-mobile"]]:
          isMinimized && minimizeBehavior === "mobile",
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
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </form>
  )
}
