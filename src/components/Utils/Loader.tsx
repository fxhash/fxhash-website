import style from "./Loader.module.scss"
import cs from "classnames"

interface Props {
  color?: "white" | "black" | "gray-light" | "currentColor"
  size?: "tiny" | "small" | "regular" | "large"
  className?: string
}

export function Loader({
  color = "black",
  size = "regular",
  className,
}: Props) {
  return (
    <div
      className={cs(style.loader, style[`size_${size}`], className)}
      style={{
        backgroundColor:
          color === "currentColor" ? color : `var(--color-${color})`,
      }}
    />
  )
}
