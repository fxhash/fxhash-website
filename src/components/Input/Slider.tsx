import style from "./Slider.module.scss"
import cs from "classnames"
import { useMemo } from "react"


export interface Props {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}

export function Slider({
  min,
  max,
  step,
  value,
  onChange
}: Props) {
  const gradient = useMemo<string>(() => {
    const T = (value-min) / (max-min)
    return `linear-gradient(to right, var(--color-black) 0%, var(--color-black) ${T*100}%, var(--color-gray-light) ${T*100}%, var(--color-gray-light) 100%)`
  }, [min, max, value])

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={evt => onChange(parseFloat(evt.target.value))}
      className={cs(style.slider)}
      style={{
        background: gradient
      }}
    />
  )
}