import cs from "classnames"
import style from "./InputReserveMintPass.module.scss"
import { TInputReserveProps } from "./InputReserve"
import { InputText } from "../InputText"

export function InputReserveMintPass({
  value,
  onChange,
  children,
}: TInputReserveProps<any>) {
  return (
    <div>
      {children}
      <InputText
        value={value}
        onChange={evt => onChange(evt.target.value)}
        placeholder="Enter the Mint Pass contract address"
        className={cs(style.input)}
      />
    </div>
  )
}
