import style from "./LargeCardLoading.module.scss"
import effect from "../../styles/Effects.module.scss"
import cs from "classnames"

interface Props {}
export function LargeCardLoading({}: Props) {
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.artwork, effect.placeholder)} />
      <div className={cs(style.content)}>
        <div className={cs(style.avatar, effect.placeholder)} />
        <div className={cs(style.name, effect.placeholder)} />
      </div>
    </div>
  )
}
