import style from "./Resolution.module.scss"
import cs from "classnames"
import { Vec2 } from "../../types/Math"
import { InputText } from "./InputText"
import { clamp } from "../../utils/math"


const integerConstraint = (x: number) => Math.round(x)

interface Props {
  value: Vec2
  min: number
  max: number
  onChange: (value: Vec2) => void
  constraint?: (value: number) => number
  className?: string
}

export function InputResolution({
  value,
  min,
  max,
  onChange,
  constraint = integerConstraint,
  className
}: Props) {
  const update = (v: number, component: "x"|"y") => {
    onChange({
      ...value,
      [component]: v
    })
  }

  const applyConstraint = (component: "x"|"y") => {
    onChange({
      ...value,
      [component]: constraint(clamp(value[component], min, max))
    })
  }

  return (
    <div className={cs(style.container, className)}>
      <InputText
        type="number"
        value={value.x}
        onChange={evt => update(parseFloat(evt.target.value), "x")}
        onBlur={() => applyConstraint("x")}
      />
      <span>*</span>
      <InputText
        type="number"
        value={value.y}
        onChange={evt => update(parseFloat(evt.target.value), "y")}
        onBlur={() => applyConstraint("y")}
      />
    </div>
  )
}