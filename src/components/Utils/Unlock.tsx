import style from "./Unlock.module.scss"
import cs from "classnames"

interface Props {
  locked: boolean
  onClick: () => void
}
export function Unlock({
  locked,
  onClick,
}: Props) {
  return (
    <div className={cs(style.container)}>
      <button onClick={onClick}>
        <i aria-hidden className="fas fa-unlock"/>
      </button>
      <span>unlock</span>
    </div>
  )  
}