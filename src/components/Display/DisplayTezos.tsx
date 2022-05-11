import style from "./DisplayTezos.module.scss"
import cs from "classnames"
import { bigMutezFormatter, displayMutez } from "../../utils/units"
import { IconTezos } from "../Icons/IconTezos"

interface Props {
  mutez: number
  className?: string
  formatBig?: boolean
  tezosSize?: "small"|"regular"|"big"
}
export function DisplayTezos({
  mutez,
  className,
  formatBig = true,
  tezosSize = "small",
}: Props) {
  return (
    <span className={cs(style.root, className)}>
      <IconTezos size={tezosSize}/>
      <span>{formatBig ? bigMutezFormatter(mutez) : displayMutez(mutez)}</span>
    </span>
  )
}