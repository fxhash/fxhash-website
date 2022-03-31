import style from "./Form.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react-router/node_modules/@types/react"

interface Props {
  className?: string
}

export function Fieldset({
  className,
  children,
}: PropsWithChildren<Props>) {
  return (
    <fieldset className={cs(style.fieldset, className)}>
      {children}
    </fieldset>
  )
}