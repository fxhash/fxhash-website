import style from "./FiltersPanel.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  onClose?: () => void
}
export function FiltersPanel({ onClose, children }: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.mobile_header)}>
        <h4>Filters</h4>
        <button type="button" onClick={onClose}>
          <i aria-hidden className="far fa-times" />
        </button>
      </div>
      <div className={cs(style.content)}>{children}</div>
    </div>
  )
}
