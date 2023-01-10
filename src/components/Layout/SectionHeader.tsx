import style from "./SectionHeader.module.scss"
import layoutStyle from "../../styles/Layout.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"

interface Props {
  layout?: "left" | "center"
  sm?: "left" | "center"
  className?: string,
  noPadding?: boolean
}

export function SectionHeader({
  layout = "left",
  sm,
  className,
  children,
  noPadding,
}: PropsWithChildren<Props>) {
  return (
    <header
      className={cs(
        style.container,
        style[`layout_${layout}`],
        {
          [style[`sm_${sm}`]]: !!sm,
          [layoutStyle["padding-big"]]: !noPadding,
        },
        className
      )}
    >
      {children}
    </header>
  )
}
