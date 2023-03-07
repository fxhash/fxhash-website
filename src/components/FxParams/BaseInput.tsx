import {
  ButtonHTMLAttributes,
  HtmlHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from "react"
import classes from "./BaseInput.module.scss"
import cx from "classnames"

export function BaseInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props
  return <input className={cx(classes.baseInput, className)} {...rest} />
}

export function BaseSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, ...rest } = props
  return <select className={cx(classes.baseSelect, className)} {...rest} />
}

export interface BaseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "secondary" | undefined
}

export function BaseButton(props: BaseButtonProps) {
  const { className, color = "primary", ...rest } = props
  return (
    <button
      type="button"
      className={cx(classes.baseButton, classes[`color-${color}`], className)}
      {...rest}
    />
  )
}

export function IconButton(props: BaseButtonProps) {
  const { className, ...rest } = props
  return <BaseButton className={cx(classes.iconButton, className)} {...rest} />
}
