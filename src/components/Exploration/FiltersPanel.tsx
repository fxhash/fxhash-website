import style from "./FiltersPanel.module.scss"
import cs from "classnames"
import { PropsWithChildren, useContext, useEffect } from "react"
import useIsMobile from "../../hooks/useIsMobile"
import { ModalContext } from "../../context/Modal"

interface Props {
  open?: boolean
  onClose?: () => void
}
export function FiltersPanel({
  open = true,
  onClose,
  children,
}: PropsWithChildren<Props>) {
  const { openModalId, closeModalId } = useContext(ModalContext)
  const isMobile = useIsMobile()
  useEffect(() => {
    if (isMobile && open) {
      openModalId("filters")
    } else {
      closeModalId("filters")
    }
    return () => {
      closeModalId("filters")
    }
  }, [closeModalId, isMobile, open, openModalId])
  return (
    <div
      className={cs(style.root, {
        [style.visible]: open,
      })}
    >
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
