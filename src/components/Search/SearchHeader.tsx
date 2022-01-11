import style from "./Search.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  sortSelectComp: React.ReactNode
  hasFilters?: boolean
  onToggleFilters?: () => void
}
export function SearchHeader({
  sortSelectComp,
  hasFilters,
  onToggleFilters,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.search_header)}>
      {hasFilters && (
        <button
          type="button"
          className={cs(style.filter_btn)}
          onClick={onToggleFilters}
        >
          <i className="fas fa-filter"/>
        </button>
      )}
      {sortSelectComp}
      {children}
    </div>
  )
}