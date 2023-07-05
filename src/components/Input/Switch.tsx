import style from "./Switch.module.scss"
import cs from "classnames"
import { InputProps } from "../../types/Inputs"
import { useState } from "react"

interface Props extends InputProps<boolean> {
  className?: string
}
export function Switch({ className, value, onChange }: Props) {
  return (
    <label className={cs(style.root, className)}>
      <input
        type="checkbox"
        checked={value}
        onChange={() => onChange(!value)}
      />
      <span className={cs(style.slider)} />
    </label>
  )
}
