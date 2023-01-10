import React from "react"
import cs from "classnames"
import style from "./CardSizeSelect.module.scss"

interface ISizeOption {
  label: "small" | "medium" | "large"
  value: number
}

const defaultCardSizeOptions: ISizeOption[] = [
  {
    label: "small",
    value: 200,
  },
  {
    label: "medium",
    value: 270,
  },
  {
    label: "large",
    value: 400,
  },
]

interface Props {
  options?: ISizeOption[]
  value?: number | null
  onChange: (size: number) => void
}

export function CardSizeSelect({
  options = defaultCardSizeOptions,
  value = null,
  onChange,
}: Props) {
  return (
    <div className={style.card_size_select}>
      {options.map((option) => (
        <button
          key={option.label}
          className={cs({ [style.active]: option.value === value })}
          onClick={() => onChange(option.value)}
        >
          <i />
        </button>
      ))}
    </div>
  )
}
