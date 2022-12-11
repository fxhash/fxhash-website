import style from "./Divider.module.scss"
import cs from "classnames"

interface Props {
  color?: "black" | "gray" | "gray-vvlight"
}
export function Divider({ color = "black" }: Props) {
  return (
    <div
      className={cs(style.root)}
      style={{ backgroundColor: `var(--color-${color})` }}
    />
  )
}
