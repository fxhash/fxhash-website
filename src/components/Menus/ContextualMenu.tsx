import style from "./ContextualMenu.module.scss"
import cs from "classnames"
import { forwardRef, PropsWithChildren } from "react"
import effects from "../../styles/Effects.module.scss"

interface Props {
  className?: string
}
export const ContextualMenu = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(({
  className,
  children,
}, ref) => {
  return (
    <div
      ref={ref}
      className={cs(style.root, effects['drop-shadow-small'], className)}
      contentEditable={false}
    >
      {children}
    </div>
  )
})

ContextualMenu.displayName = "ContextualMenu"