import cs from "classnames"
import style from "./SectionWrapper.module.scss"
import layoutStyle from "../../styles/Layout.module.scss"
import { PropsWithChildren } from "react"

type TLayout = "padding-big" | "padding-small" | "fixed-width-centered"

interface Props {
  layout?: TLayout
}
export function SectionWrapper({
  layout = "padding-big",
  children,
}: PropsWithChildren<Props>) {
  return layout === "padding-big" || layout === "padding-small"  ? (
    <section className={cs(layoutStyle[layout])}>
      {children}
    </section>
  ):(
    <section className={cs(style.layout_fixed_width_centered_wrapper)}>
      <div className={cs(style.layout_fixed_width_centered)}>
        {children}
      </div>
    </section>
  )
}