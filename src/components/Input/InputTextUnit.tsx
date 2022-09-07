import style from "./Input.module.scss"
import cs from "classnames"
import { InputText, Props as InputProps } from "./InputText"
import { ReactNode } from "react"


interface Props extends InputProps {
  unit: ReactNode
  sizeX?: "regular" | "small"
}

export function InputTextUnit({
  unit,
  sizeX = "regular",
  ...props
}: Props) {
  return (
    <div className={cs(style.textunit, style[`size-${sizeX}`])}>
      <InputText {...props} />
      <span>{ unit }</span>
    </div>
  )
}