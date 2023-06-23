import style from "./Submit.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  layout?: "left" | "center" | "center-vertical"
  preventSubmitOnKeydownEnter?: boolean
  className?: string
}
export function Submit({
  layout,
  children,
  preventSubmitOnKeydownEnter,
  className,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root, style[`layout_${layout}`], className)}>
      {preventSubmitOnKeydownEnter && (
        <button
          type="submit"
          disabled
          className={style.hide}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  )
}
