import style from "./Input.module.scss"
import cs from "classnames"
import { InputHTMLAttributes, forwardRef, useEffect } from "react"


export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  readOnly?: boolean
  error?: boolean
}

export const InputText = forwardRef<HTMLInputElement, Props>(({
  readOnly,
  error,
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      {...props}
      className={cs(style.input, style.text, props.className, {
        [style.error]: !!error
      })}
      readOnly={readOnly}
    />
  )
})