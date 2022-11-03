import style from "./Modal.module.scss"
import cs from "classnames"
import { Cover } from "./Cover"
import { PropsWithChildren, useCallback, useEffect } from "react"
import effects from "../../styles/Effects.module.scss"
import ReactDOM from "react-dom"

export interface Props {
  title: string
  onClose: () => void
  index?: number
  className?: string
}
export function Modal({
  title,
  index = 999999,
  onClose,
  className,
  children,
}: PropsWithChildren<Props>) {
  const handleClose = useCallback(() => {
    document.body.classList.remove("modal-open")
    onClose()
  }, [onClose])
  useEffect(() => {
    document.body.classList.add("modal-open")
  }, [])
  return ReactDOM.createPortal(
    <>
      <Cover onClick={handleClose} index={index} />
      <div
        className={cs(style.modal, effects["drop-shadow-big"], className)}
        style={{ zIndex: index + 1 }}
      >
        <header>
          <span>{title}</span>
          <button className={cs(style.btn_close)} onClick={handleClose}>
            <i aria-hidden className="far fa-times" />
          </button>
        </header>
        <main>{children}</main>
      </div>
    </>,
    document.body
  )
}
