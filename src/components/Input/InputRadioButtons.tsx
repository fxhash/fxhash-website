import style from "./InputRadioButtons.module.scss"
import cs from "classnames"

export interface RadioOption<T = any> {
  value: T
  label: string
}

interface Props<T = any> {
  value: T
  onChange: (value: T) => void
  options: RadioOption<T>[]
}
export function InputRadioButtons({
  value,
  onChange,
  options,
}: Props) {
  return (
    <div className={cs(style.root)}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          className={cs({
            [style.active]: option.value === value
          })}
          onClick={() => option.value !== value && onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}