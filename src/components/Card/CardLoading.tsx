import style from "./CardLoading.module.scss"
import cardStyle from "./Card.module.scss"
import effect from "../../styles/Effects.module.scss"
import cs from "classnames"

export function CardLoading() {
  return (
    <div className={cs(cardStyle.container, style.container)}>
      <div
        className={cs(cardStyle["thumbnail-container"], effect.placeholder)}
      />
      <div
        className={cs(cardStyle.content, style.content, effect.placeholder)}
      />
    </div>
  )
}
