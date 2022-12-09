import layout from "styles/Layout.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"
import { Spacing } from "./Spacing"

type Props = PropsWithChildren<{
  padding: "big" | "small"
  marginTop?: "3x-large" | "6x-large"
}>
export function PageLayout({
  padding,
  marginTop = "3x-large",
  children,
}: Props) {
  return (
    <>
      <Spacing size={marginTop} />
      <main className={cs(layout[`padding-${padding}`])}>{children}</main>
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}
