import style from "./Cover.module.scss"
import cs from "classnames"

interface Props {
  index?: number
  onClick: () => void
  opacity?: number
}
export function Cover({
  index,
  opacity = 0.3,
  onClick
}: Props) {
  return (
    <div
      style={{ zIndex: index, opacity }}
      onClick={onClick}
      className={cs(style.cover)}
    />
  )
}