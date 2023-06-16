import style from "./DropdownList.module.scss"
import { PropsWithChildren } from "react"
import cs from "classnames"

interface DropdownListProps {
  itemComp: React.ReactNode
  btnClassName?: string
  ariaLabel?: string
  onToggle?: () => void
  open: boolean
}

export function DropdownList({
  itemComp,
  btnClassName,
  ariaLabel,
  onToggle,
  open,
  children,
}: PropsWithChildren<DropdownListProps>) {
  return (
    <>
      <button
        className={cs(style.button, btnClassName)}
        aria-label={ariaLabel}
        onClick={onToggle}
      >
        <span>{itemComp}</span>
        <span>
          {open ? (
            <i aria-hidden className="fa-solid fa-caret-up" />
          ) : (
            <i aria-hidden className="fa-solid fa-caret-down" />
          )}
        </span>
      </button>
      {open && <div>{children}</div>}
    </>
  )
}
