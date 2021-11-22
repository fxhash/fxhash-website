import style from "./Cover.module.scss"
import cs from "classnames"

interface Props {
  index?: number
  onClick: () => void
}
export function Cover({
  index,
  onClick
}: Props) {
  return (
    <div
      style={{ zIndex: index }}
      onClick={onClick}
      className={cs(style.cover)}
    />
  )
}