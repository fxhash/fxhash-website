import style from "./Search.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { forwardRef, PropsWithChildren } from "react"

interface Props {
  sortSelectComp: React.ReactNode
  hasFilters?: boolean
  onToggleFilters?: () => void
  filtersOpened?: boolean
  padding?: "big"|"small",
  showFiltersOnMobile?: boolean,
}
export const SearchHeader = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(({
  sortSelectComp,
  hasFilters,
  onToggleFilters,
  filtersOpened,
  padding = "big",
  children,
  showFiltersOnMobile = true,
}, ref) => {
  return (
    <div className={cs(
      style.search_header,
      layout[`padding-${padding}`]
    )} ref={ref}>
      <div className={cs(style.search_wrapper)}>
        {hasFilters && (
          <button
            type="button"
            className={cs(style.filter_btn, {
              [style.filters_opened]: filtersOpened,
              [style['filter_btn--show-mobile']]: showFiltersOnMobile,
            })}
            onClick={onToggleFilters}
          >
            {filtersOpened ? (
              <i aria-hidden className="fas fa-caret-left"/>
            ):(
              <i aria-hidden className="fas fa-filter"/>
            )}
            <span>filters</span>
          </button>
        )}
        {children}
      </div>
      {sortSelectComp}
    </div>
  )
})
SearchHeader.displayName = 'SearchHeader';
