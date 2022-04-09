import style from "./InputReserveWhitelist.module.scss"
import cs from "classnames"
import { InputProps } from "../../../types/Inputs"
import { TInputReserveProps } from "./InputReserve"
import { InputSplits } from "../InputSplits"
import { transformSplitsAccessList } from "../../../utils/transformers/splits"


export function InputReserveWhitelist({
  value,
  onChange,
  children,
}: TInputReserveProps<any>) {
  return (
    <div>
      {children}
      <InputSplits
        value={value}
        onChange={onChange}
        textShares="Nb of editions"
        defaultShares={1}
        sharesTransformer={transformSplitsAccessList}
        showPercentages={false}
      />
    </div>
  )
}