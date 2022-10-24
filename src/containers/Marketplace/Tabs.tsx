import style from "./MarketplaceTabs.module.scss"
import { PropsWithChildren } from "react"
import Link from "next/link"
import { TabDefinition, Tabs } from "../../components/Layout/Tabs"

const definition: TabDefinition[] = [
  { name: "listed", props: { href: "/marketplace" } },
  { name: "collections", props: { href: "/marketplace/collections" } },
]

interface TabProps {
  href: string
  className: string
}
export function MarketplaceTab({
  href,
  className,
  children,
}: PropsWithChildren<TabProps>) {
  return (
    <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
  )
}

interface Props {
  active: number
}
export function MarketplaceTabs({ active }: Props) {
  return (
    <Tabs
      className={style.tabs}
      tabDefinitions={definition}
      activeIdx={active}
      tabsLayout="fixed-size"
      tabWrapperComponent={MarketplaceTab}
    />
  )
}
