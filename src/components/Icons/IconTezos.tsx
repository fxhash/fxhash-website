import style from "./IconTezos.module.scss"
import cs from "classnames"

export interface Props {
  size?: "small" | "regular" | "big"
  className?: string
}
export function IconTezos({ size = "regular", className }: Props) {
  return (
    <span
      className={cs(
        "icon-tezos-xtz-logo",
        style.tezos,
        style[`tezos_${size}`],
        className
      )}
    />
  )
}
