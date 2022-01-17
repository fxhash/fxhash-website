import style from "./DisplayTezos.module.scss"
import cs from "classnames"
import { bigMutezFormatter, displayMutez } from "../../utils/units"

interface Props {
  mutez: number
  className?: string
  formatBig?: boolean
}
export function DisplayTezos({
  mutez,
  className,
  formatBig = true,
}: Props) {
  return (
    <span className={cs(style.root, className)}>
      <span className={cs('icon-tezos-xtz-logo', style.tezos)}/>
      <span>{formatBig ? bigMutezFormatter(mutez) : displayMutez(mutez)}</span>
    </span>
  )
}