import style from "./Switch.module.scss"
import cs from "classnames"
import { InputProps } from "../../types/Inputs"
import { useState } from "react"

interface Props extends InputProps<boolean> {}
export function Switch({ value, onChange }: Props) {
  return (
    <label className={cs(style.root)}>
      <input
        type="checkbox"
        checked={value}
        onChange={() => onChange(!value)}
      />
      <span className={cs(style.slider)} />
    </label>
  )
}
