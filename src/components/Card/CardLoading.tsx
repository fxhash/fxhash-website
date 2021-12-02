import style from "./CardLoading.module.scss"
import cardStyle from "./Card.module.scss"
import cs from "classnames"

export function CardLoading() {
  return (
    <div className={cs(cardStyle.container, style.container)}>
      <div className={cs(cardStyle['thumbnail-container'], style.gradient)}/>
      <div className={cs(cardStyle.content, style.content, style.gradient, style.gradient_white)}/>
    </div>
  )
}