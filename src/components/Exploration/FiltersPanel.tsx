import style from "./FiltersPanel.module.scss"
import cs from "classnames"
import { PropsWithChildren, useEffect, useMemo } from "react"
import useWindowSize, { breakpoints } from "../../hooks/useWindowsSize";

interface Props {
  onClose?: () => void
}
export function FiltersPanel({ onClose, children }: PropsWithChildren<Props>) {
  const { width } = useWindowSize()
  const isMobile = useMemo(
    () => width !== undefined && width <= breakpoints.sm,
    [width]
  )
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add("modal-open")
    } else {
      document.body.classList.remove("modal-open")
    }
    return () => {
      document.body.classList.remove("modal-open")
    }
  }, [isMobile])
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
