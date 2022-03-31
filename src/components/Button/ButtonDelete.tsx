import style from "./ButtonDelete.module.scss"
import cs from "classnames"

interface Props {
  onClick: () => void
  disabled?: boolean
}
export function ButtonDelete({
  onClick,
  disabled,
}: Props) {
  return (
    <button
      type="button"
      className={cs(style.btn_delete)}
      onClick={onClick}
      disabled={disabled}
    >
      <i aria-hidden className="fa-solid fa-circle-xmark"/>
    </button>
  )
}