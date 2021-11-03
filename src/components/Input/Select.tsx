import style from "./Select.module.scss"
import cs from "classnames"
import { InputHTMLAttributes } from "react"


interface IOptions {
  label: string
  value: any
  disabled?: boolean
}

interface Props extends InputHTMLAttributes<HTMLSelectElement> {
  options: IOptions[]
  value: any
  onChange: (value: any) => void
}

export function Select({
  options,
  value,
  onChange,
  placeholder,
  ...props
}: Props) {
  return (
    <div className={cs(style.select, {
      [style.placeholder]: value === ""
    })}>
      <select value={value} onChange={(evt) => onChange(evt.target.value)} {...props}>
        {placeholder && <option value="" disabled>{ placeholder }</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value} disabled={!!opt.disabled}>
            { opt.label }
          </option>
        ))}
      </select>
      <div className={cs(style.focus)}/>
    </div>
  )
}