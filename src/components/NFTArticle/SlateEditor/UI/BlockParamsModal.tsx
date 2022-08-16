import style from "./BlockParamsModal.module.scss"
import effects from "../../../../styles/Effects.module.scss"
import cs from "classnames"
import { PropsWithChildren, useRef } from "react"
import useClickOutside from "../../../../hooks/useClickOutside"

interface Props {
  onClose: () => void
  className?: string
}
export function BlockParamsModal({
  onClose,
  className,
  children,
}: PropsWithChildren<Props>) {
  const rootRef = useRef<HTMLDivElement>(null)
  useClickOutside(rootRef, onClose, false)

  return (
    <div 
      ref={rootRef}
      className={cs(style.root, effects['drop-shadow-small'], className)}
      contentEditable={false}
    >
      {children}
    </div>
  )
}