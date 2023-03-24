import style from "./ButtonDelete.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  onClick: () => void
  disabled?: boolean
  className?: string
}
export function ButtonDelete({
  onClick,
  disabled,
  className,
  children,
}: PropsWithChildren<Props>) {
  return (
    <button
      type="button"
      className={cs(style.btn_delete, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children && children + " "}
      <i aria-hidden className="fa-solid fa-circle-xmark" />
    </button>
  )
}
