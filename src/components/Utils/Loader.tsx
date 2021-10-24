import style from "./Loader.module.scss"
import cs from "classnames"

interface Props {
  color?: "white" | "black"
}

export function Loader({
  color = "black"
}: Props) {
  return (
    <div 
      className={cs(style.loader)}
      style={{
        backgroundColor: `var(--color-${color})`
      }}
    />
  )
}