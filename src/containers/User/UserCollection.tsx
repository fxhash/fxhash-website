import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import Link, { LinkProps } from "next/link"
import { PropsWithChildren, HTMLAttributes } from "react"
import { User } from "../../types/entities/User"
import { Spacing } from "../../components/Layout/Spacing"
import { getUserProfileLink } from "../../utils/user"
import { checkIsTabKeyActive, Tabs } from "../../components/Layout/Tabs"
import { UserCollectionGentks } from "./Collection/Gentks"
import { UserCollectionArticles } from "./Collection/Articles"
import { UserCollectionTickets } from "./Collection/Tickets"

type TabWrapperProps = PropsWithChildren<LinkProps> &
  HTMLAttributes<HTMLAnchorElement>
const TabWrapper = ({ children, onClick, ...props }: TabWrapperProps) => (
  <Link {...props}>
    <a className={props.className} onClick={onClick}>
      {children}
    </a>
  </Link>
)

interface Props {
  user: User
  activeTab: "gentk" | "articles" | "tickets"
}
export function UserCollection({ user, activeTab }: Props) {
  // TABS href are computed using the user profile URL
  const TABS = [
    {
      key: "gentk",
      name: "gentk",
      props: {
        scroll: false,
        href: `${getUserProfileLink(user)}/collection/`,
      },
    },
    {
      key: "articles",
      name: "articles",
      props: {
        scroll: false,
        href: `${getUserProfileLink(user)}/collection/articles/`,
      },
    },
    {
      key: "tickets",
      name: "tickets",
      props: {
        scroll: false,
        href: `${getUserProfileLink(user)}/collection/tickets/`,
      },
    },
  ]

  return (
    <>
      <Spacing size="2x-small" sm="regular" />

      <Tabs
        tabDefinitions={TABS}
        checkIsTabActive={checkIsTabKeyActive}
        activeIdx={activeTab}
        tabsLayout="subtabs-vertical"
        tabsClassName={cs(layout["padding-big"])}
        tabWrapperComponent={TabWrapper}
      />

      {activeTab === "gentk" && <UserCollectionGentks user={user} />}

      {activeTab === "articles" && <UserCollectionArticles user={user} />}

      {activeTab === "tickets" && <UserCollectionTickets user={user} />}
    </>
  )
}
