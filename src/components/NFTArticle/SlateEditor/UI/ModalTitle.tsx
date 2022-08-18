import style from "./ModalTitle.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  
}
export function ModalTitle({
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      {children}
    </div>
  )
}