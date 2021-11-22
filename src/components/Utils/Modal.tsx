import style from "./Modal.module.scss"
import cs from "classnames"
import { Cover } from "./Cover"
import { PropsWithChildren } from "react"
import effects from "../../styles/Effects.module.scss"

interface Props {
  title: string
  onClose: () => void
  index?: number
}
export function Modal({
  title,
  index = 999999,
  onClose,
  children
}: PropsWithChildren<Props>) {
  return (
    <>
      <Cover onClick={onClose} index={index} />
      <div 
        className={cs(style.modal, effects['drop-shadow-big'])}
        style={{ zIndex: index+1 }}
      >
        <header>
          <span>{ title }</span>
          <button
            className={cs(style.btn_close)}
            onClick={onClose}
          >
            <i aria-hidden className="fas fa-times"/>
          </button>
        </header>
        <main>
          {children}
        </main>
      </div>
    </>
  )
}