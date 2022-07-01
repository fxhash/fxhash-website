import style from "./FiltersSubGroup.module.scss"
import cs from "classnames"
import { PropsWithChildren, useState } from "react"

/**
 * A FiltersSubGroup is an expandanble group designed to fit within a
 * FiltersGroup, in a Filters Panel
 */
interface Props {
  title: string
  expandDefault?: boolean
}
export function FiltersSubGroup({
  title,
  expandDefault = false,
  children,
}: PropsWithChildren<Props>) {
  const [expanded, setExpanded] = useState<boolean>(expandDefault)

  return (
    <div className={cs(style.root)}>
      <button 
        type="button"
        className={cs(style.header)}
        onClick={() => setExpanded(!expanded)}
      >
        <span>{title}</span>
        <i className={`fas fa-caret-${expanded?"down":"left"}`}/>
      </button>
      {expanded && (
        <main>{children}</main>
      )}
    </div>    
  )
}