import style from "./Input.module.scss"
import cs from "classnames"
import { InputHTMLAttributes } from "react"


interface Props extends InputHTMLAttributes<HTMLInputElement> {
  readOnly?: boolean
}

export function InputText({
  readOnly,
  ...props
}: Props) {
  return (
    <input
      type="text"
      {...props}
      className={cs(style.input, style.text, props.className)}
      readOnly={readOnly}
    />
  )
}