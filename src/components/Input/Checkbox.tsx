import style from "./Checkbox.module.scss"
import cs from "classnames"
import { PropsWithChildren, InputHTMLAttributes, ChangeEvent } from "react"


// @ts-ignore
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  value: boolean
  name?: string
  onChange: (value: boolean, event?: ChangeEvent<HTMLInputElement>) => void
}

export function Checkbox({
  value,
  name,
  onChange,
  className,
  children
}: PropsWithChildren<Props>) {
  return (
    <label className={cs(style.container, className)}>
      <input type="checkbox" name={name} checked={value} onChange={event => onChange(!value, event)} />
      <span className={cs(style.checkmark)}></span>
      {children}
    </label>
  )
}