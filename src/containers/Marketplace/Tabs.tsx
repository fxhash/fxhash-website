import style from "./MarketplaceTabs.module.scss"
import { PropsWithChildren } from "react"
import Link from "next/link"
import {
  checkIsTabKeyActive,
  TabDefinition,
  Tabs,
} from "../../components/Layout/Tabs"

const definition: TabDefinition[] = [
  {
    key: "listed",
    name: "listed",
    props: {
      href: "/marketplace",
    },
  },
  {
    key: "sold",
    name: "sold",
    props: { href: "/marketplace/sold" },
  },
  {
    key: "collections",
    name: "collections",
    props: { href: "/marketplace/collections" },
  },
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
  activeKey: "listed" | "sold" | "collections"
}
export function MarketplaceTabs({ activeKey }: Props) {
  return (
    <Tabs
      className={style.tabs}
      tabDefinitions={definition}
      checkIsTabActive={checkIsTabKeyActive}
      activeIdx={activeKey}
      tabsLayout="fixed-size"
      tabWrapperComponent={MarketplaceTab}
    />
  )
}
