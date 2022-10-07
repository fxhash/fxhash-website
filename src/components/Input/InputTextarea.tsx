import style from "./Input.module.scss"
import cs from "classnames"
import { InputHTMLAttributes } from "react"
import { TextareaHTMLAttributes } from "react"

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function InputTextarea({ error, ...props }: Props) {
  return (
    <textarea
      {...props}
      className={cs(style.input, style.texarea, style.text, props.className, {
        [style.error]: !!error,
      })}
    />
  )
}
