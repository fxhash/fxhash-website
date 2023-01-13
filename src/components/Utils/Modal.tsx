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

type ModalElements = {
  firstFocusableElement: HTMLElement | null
  lastFocusableElement: HTMLElement | null
}
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
  const refModal = useRef<HTMLDivElement>(null)
  const refModalElements = useRef<ModalElements>({
    firstFocusableElement: null,
    lastFocusableElement: null,
  })
  const { openModalId, closeModalId } = useContext(ModalContext)
  const handleClose = useCallback(() => {
    closeModalId(refModalId.current)
    onClose()
  }, [closeModalId, onClose])
  const handleKeyboardNavigation = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
      return
    }
    const { firstFocusableElement, lastFocusableElement } =
      refModalElements.current
    let isTabPressed = e.key === "Tab" || e.keyCode === 9
    if (!isTabPressed) {
      return
    }
    if (e.shiftKey) {
      if (
        document.activeElement === firstFocusableElement &&
        lastFocusableElement
      ) {
        lastFocusableElement.focus()
        e.preventDefault()
      }
    } else {
      if (
        document.activeElement === lastFocusableElement &&
        firstFocusableElement
      ) {
        firstFocusableElement.focus()
        e.preventDefault()
      }
    }
  }, [])
  useEffect(() => {
    const modalId = refModalId.current
    openModalId(modalId)
    return () => {
      closeModalId(modalId)
    }
  }, [closeModalId, openModalId])
  useEffect(() => {
    const modal = refModal.current
    if (!modal) return
    const focusableElements =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const firstFocusableElement = modal.querySelectorAll(
      focusableElements
    )[0] as HTMLElement
    const focusableContent = modal.querySelectorAll(focusableElements)
    refModalElements.current.firstFocusableElement = firstFocusableElement
    refModalElements.current.lastFocusableElement = focusableContent[
      focusableContent.length - 1
    ] as HTMLElement
    document.addEventListener("keydown", handleKeyboardNavigation)
    firstFocusableElement.focus()
    return () => {
      document.removeEventListener("keydown", handleKeyboardNavigation)
    }
  }, [handleKeyboardNavigation])
  return ReactDOM.createPortal(
    <>
      <Cover onClick={handleClose} index={index} />
      <div
        ref={refModal}
        className={cs(style.modal, effects["drop-shadow-big"], className)}
        style={{ zIndex: index + 1 }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
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
