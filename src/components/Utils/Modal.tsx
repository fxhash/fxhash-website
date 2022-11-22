import style from "./Modal.module.scss"
import cs from "classnames"
import { Cover } from "./Cover"
import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react"
import effects from "../../styles/Effects.module.scss"
import ReactDOM from "react-dom"
import { ModalContext } from "../../context/Modal"
import { nanoid } from "nanoid"

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
  const refModalId = useRef(`modal-${nanoid(11)}`)
  const { openModalId, closeModalId } = useContext(ModalContext)
  const handleClose = useCallback(() => {
    closeModalId(refModalId.current)
    onClose()
  }, [closeModalId, onClose])
  useEffect(() => {
    const modalId = refModalId.current
    openModalId(modalId)
    return () => {
      closeModalId(modalId)
    }
  }, [closeModalId, openModalId])
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
