import style from "./Loader.module.scss"
import cs from "classnames"

interface Props {}

export function Loader() {
  return (
    <div className={cs(style.loader)}/>
  )
}