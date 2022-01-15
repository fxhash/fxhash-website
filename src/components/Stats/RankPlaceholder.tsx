import style from "./RankPlaceholder.module.scss"
import cs from "classnames"

interface Props {
  
}
export function RankPlaceholder({
  
}: Props) {
  return (
    <div className={cs(style.root)}>
      <div>A</div>
      <div>textext</div>
    </div>
  )
}