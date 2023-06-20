import layout from "styles/Layout.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"
import { Spacing } from "./Spacing"

type Props = PropsWithChildren<{
  padding: "big" | "small"
  marginTop?: "2x-large" | "3x-large" | "6x-large"
  columnCentered?: boolean
}>
export function PageLayout({
  padding,
  marginTop = "2x-large",
  columnCentered = false,
  children,
}: Props) {
  return (
    <>
      <Spacing size={marginTop} />
      <main
        className={cs(layout[`padding-${padding}`], {
          [layout.w900]: columnCentered,
        })}
      >
        {children}
      </main>
      <Spacing size="6x-large" sm="3x-large" />
      <Spacing size="6x-large" sm="none" />
    </>
  )
}
