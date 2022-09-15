import style from "./RankPlaceholder.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"

interface Props {}
export function RankPlaceholder({}: Props) {
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.icon, effects.placeholder)} />
      <div className={cs(style.details, effects.placeholder)} />
    </div>
  )
}
