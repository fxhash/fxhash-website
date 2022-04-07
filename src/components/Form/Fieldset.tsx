import style from "./Form.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react-router/node_modules/@types/react"

interface Props {
  className?: string
  error?: string
	errorPos?: "top-right" | "bottom-left"
}

export function Fieldset({
  className,
  error,
  errorPos = "top-right",
  children,
}: PropsWithChildren<Props>) {
  return (
    <fieldset className={cs(style.fieldset, className, {
      [style.field_error]: !!error,
    })}>
      {error && (
        <div className={cs(style.error, style[`error-${errorPos}`])}>
          {error}
        </div>
      )}
      {children}
    </fieldset>
  )
}