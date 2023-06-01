import React from "react"
import cs from "classnames"
import style from "./InputMultiIcons.module.scss"

interface Option<T> {
  key?: string
  label: any
  value: T
}
interface Props<T> {
  className: string
  options: Option<T>[]
  value?: T | null
  onChange: (opt: Option<T>) => void
}

export function InputMultiIcons<T>({
  className,
  options,
  value = null,
  onChange,
}: Props<T>) {
  return (
    <div className={cs(style.container, className)}>
      {options.map((option) => (
        <button
          key={option.key || (option.value as any)}
          className={cs({ [style.active]: option.value === value })}
          onClick={() => onChange(option)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
