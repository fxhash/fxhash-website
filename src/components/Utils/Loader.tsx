import style from "./Loader.module.scss"
import cs from "classnames"

interface Props {
  color?: "white" | "black"
  size?: "tiny" | "small" | "regular" | "large"
}

export function Loader({
  color = "black",
  size = "regular"
}: Props) {
  return (
    <div 
      className={cs(style.loader, style[`size_${size}`])}
      style={{
        backgroundColor: `var(--color-${color})`
      }}
    />
  )
}