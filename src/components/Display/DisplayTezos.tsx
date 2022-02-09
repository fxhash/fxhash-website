import style from "./DisplayTezos.module.scss"
import cs from "classnames"
import { bigMutezFormatter, displayMutez } from "../../utils/units"

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
      <span className={cs('icon-tezos-xtz-logo', style.tezos, style[`tezos_${tezosSize}`])}/>
      <span>{formatBig ? bigMutezFormatter(mutez) : displayMutez(mutez)}</span>
    </span>
  )
}