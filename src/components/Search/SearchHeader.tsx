import style from "./Search.module.scss"
import cs from "classnames"
import { forwardRef, PropsWithChildren } from "react"

interface Props {
  sortSelectComp: React.ReactNode
  hasFilters?: boolean
  onToggleFilters?: () => void
}
export const SearchHeader = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(({
  sortSelectComp,
  hasFilters,
  onToggleFilters,
  children,
}, ref) => {
  return (
    <div className={cs(style.search_header)} ref={ref}>
      {hasFilters && (
        <button
          type="button"
          className={cs(style.filter_btn)}
          onClick={onToggleFilters}
        >
          <i className="fas fa-filter"/>
          <span>filters</span>
        </button>
      )}
      {children}
      {sortSelectComp}
    </div>
  )
})