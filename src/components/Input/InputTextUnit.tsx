import style from "./Input.module.scss"
import cs from "classnames"
import { InputText, Props as InputProps } from "./InputText"
import { ReactNode } from "react"

interface Props extends InputProps {
  unit: ReactNode
  sizeX?: "regular" | "small" | "fill"
  positionUnit?: "inside-left" | "inside-right" | "outside"
}

export function InputTextUnit({
  unit,
  sizeX = "regular",
  positionUnit = "outside",
  ...props
}: Props) {
  return (
    <div
      className={cs(style.textunit, style[`size-${sizeX}`], {
        [style.inside]: positionUnit === "inside-left",
      })}
    >
      <InputText {...props} />
      <span>{unit}</span>
    </div>
  )
}
