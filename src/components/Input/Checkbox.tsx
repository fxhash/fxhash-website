import style from "./Checkbox.module.scss"
import cs from "classnames"
import { PropsWithChildren, InputHTMLAttributes, ChangeEvent } from "react"

// @ts-ignore
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  value: boolean
  isRadio?: boolean
  name?: string
  onChange: (value: boolean, event?: ChangeEvent<HTMLInputElement>) => void
  paddingLeft?: boolean
}

export function Checkbox({
  value,
  name,
  onChange,
  className,
  isRadio,
  paddingLeft = true,
  children,
}: PropsWithChildren<Props>) {
  return (
    <label
      className={cs(style.container, className, {
        [style.radio]: isRadio,
        [style.no_pad]: !paddingLeft,
      })}
    >
      <input
        type="checkbox"
        name={name}
        checked={value}
        onChange={(event) => onChange(!value, event)}
      />
      <span className={cs(style.checkmark)}></span>
      {children}
    </label>
  )
}
