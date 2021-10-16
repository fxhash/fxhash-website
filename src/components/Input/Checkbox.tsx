import style from "./Checkbox.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"


interface Props {
  value: boolean
  onChange: (value: boolean) => void
}

export function Checkbox({
  value,
  onChange,
  children
}: PropsWithChildren<Props>) {
  return (
    <label className={cs(style.container)}>
      <input type="checkbox" checked={value} onChange={() => onChange(!value)} />
      <span className={cs(style.checkmark)}></span>
      {children}
    </label>
  )
}