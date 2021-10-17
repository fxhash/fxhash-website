import style from "./Input.module.scss"
import cs from "classnames"
import { InputHTMLAttributes } from "react"


export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  readOnly?: boolean
  error?: boolean
}

export function InputText({
  readOnly,
  error,
  ...props
}: Props) {
  return (
    <input
      type="text"
      {...props}
      className={cs(style.input, style.text, props.className, {
        [style.error]: !!error
      })}
      readOnly={readOnly}
    />
  )
}