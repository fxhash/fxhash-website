import style from "./ButtonDelete.module.scss"
import cs from "classnames"

interface Props {
  onClick: () => void
}
export function ButtonDelete({
  onClick
}: Props) {
  return (
    <button
      type="button"
      className={cs(style.btn_delete)}
      onClick={onClick}
    >
      <i aria-hidden className="fa-solid fa-circle-xmark"/>
    </button>
  )
}