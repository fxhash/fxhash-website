import style from "./SearchInput.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { FormEvent, useCallback, useMemo, useRef, useState } from "react"
import useClickOutside from "../../hooks/useClickOutside";
import useWindowSize, { breakpoints } from "../../hooks/useWindowsSize";


interface Props {
  placeholder: string
  value: string
  className?: string
  onChange: (value: string) => void
  onSearch: (value: string) => void
  minimizeOnMobile?: boolean,
}

export function SearchInput({
  placeholder,
  value,
  onSearch,
  className,
  onChange,
  minimizeOnMobile = false
}: Props) {
  const refInput = useRef<HTMLInputElement>(null);
  const refForm = useRef<HTMLFormElement>(null);
  const [isMinimizedOnMobile, setIsMinimizedOnMobile] = useState(minimizeOnMobile);
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width !== undefined && (width <= breakpoints.sm), [width]);
  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isMobile && minimizeOnMobile) {
      setIsMinimizedOnMobile(true);
    }
    onSearch(value);
  }, [isMobile, minimizeOnMobile, onSearch, value]);
  const handleToggleMinimize = useCallback(() => {
    if (isMobile && minimizeOnMobile) {
      setIsMinimizedOnMobile(state => !state)
    }
    if (refInput.current && refInput.current.scrollWidth > 0) {
      refInput.current.focus();
    }
  }, [isMobile, minimizeOnMobile]);
  useClickOutside(refForm, () => setIsMinimizedOnMobile(true),
    !minimizeOnMobile || (minimizeOnMobile && isMobile && isMinimizedOnMobile));
  return (
    <form
      ref={refForm}
      className={cs(style.search, effects['drop-shadow-small'], className, {
        [style['search--minimize']]: isMinimizedOnMobile,
      })}
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className={cs(style['search-icon'])}
        aria-label="search"
        onClick={handleToggleMinimize}
      >
        <i className="fas fa-search"/>
      </button>
      <input
        ref={refInput}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </form>
  )
}
