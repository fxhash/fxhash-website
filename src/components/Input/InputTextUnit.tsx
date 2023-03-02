import style from "./Input.module.scss"
import cs from "classnames"
import { InputText, Props as InputProps } from "./InputText"
import { ReactNode } from "react"

interface Props extends InputProps {
  unit: ReactNode
  sizeX?: "regular" | "small"
  classNameContainer?: string
}

export function InputTextUnit({
  unit,
  classNameContainer,
  sizeX = "regular",
  ...props
}: Props) {
  return (
    <div
      className={cs(style.textunit, style[`size-${sizeX}`], classNameContainer)}
    >
      <InputText {...props} />
      <span>{unit}</span>
    </div>
  )
}
