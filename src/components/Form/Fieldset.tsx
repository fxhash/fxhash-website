import style from "./Form.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react-router/node_modules/@types/react"

export function Fieldset({ children }: PropsWithChildren<any>) {
  return (
    <fieldset className={cs(style.fieldset)}>
      {children}
    </fieldset>
  )
}