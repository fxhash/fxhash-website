import style from "./Input.module.scss"
import cs from "classnames"
import { InputText, Props as InputProps } from "./InputText"
import { ReactNode } from "react"

interface Props extends InputProps {
  unit: ReactNode
  classNameContainer?: string
  sizeX?: "regular" | "small" | "fill"
  positionUnit?: "inside-left" | "inside-right" | "outside"
}

export function InputTextUnit({
  unit,
  classNameContainer,
  sizeX = "regular",
  positionUnit = "outside",
  ...props
}: Props) {
  return (
    <div
      className={cs(
        style.textunit,
        style[`size-${sizeX}`],
        classNameContainer,
        {
          [style.inside]: positionUnit === "inside-left",
        }
      )}
    >
      <InputText {...props} />
      <span>{unit}</span>
    </div>
  )
}
