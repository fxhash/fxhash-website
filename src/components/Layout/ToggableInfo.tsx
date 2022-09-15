import style from "./ToggableInfo.module.scss"
import text from "../../styles/Text.module.css"
import cs from "classnames"
import { PropsWithChildren, ReactNode, useEffect, useState } from "react"

interface Props {
  label: string
  placeholder: ReactNode
  toggled?: boolean
  onToggled?: () => void
}
export function ToggableInfo({
  label,
  placeholder,
  toggled = false,
  onToggled,
  children,
}: PropsWithChildren<Props>) {
  const [opened, setOpened] = useState<boolean>(toggled)

  useEffect(() => {
    toggled && onToggled?.()
  }, [toggled])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpened(!opened)}
        className={cs(style.btn_toggle)}
      >
        <i
          className={`fa-solid fa-angle-${opened ? "up" : "down"}`}
          aria-hidden
        />
        <strong>{label}</strong>
      </button>

      {opened ? (
        children
      ) : (
        <span className={cs(text.info)} onClick={() => setOpened(!opened)}>
          {placeholder}
        </span>
      )}
    </>
  )
}
