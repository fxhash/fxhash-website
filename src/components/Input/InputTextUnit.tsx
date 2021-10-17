import style from "./Input.module.scss"
import cs from "classnames"
import { InputText, Props as InputProps } from "./InputText"


interface Props extends InputProps {
  unit: string
}

export function InputTextUnit({
  unit,
  ...props
}: Props) {
  return (
    <div className={cs(style.textunit)}>
      <InputText {...props} />
      <span>{ unit }</span>
    </div>
  )
}