import React, { memo, useMemo } from "react"
import layout from "../../styles/Layout.module.scss"
import {
  checkIsTabKeyActive,
  LinkTabWrapper,
  Tabs,
} from "../../components/Layout/Tabs"
import style from "./UserDashboard.module.scss"
import { UserSales } from "./UserSales"
import { UserActions } from "./UserActions"
import { getUserProfileLink } from "../../utils/user"
import { User } from "../../types/entities/User"
import { UserOffersReceived } from "./UserOffersReceived"
import { UserOffersSent } from "./UserOffersSent"
import cs from "classnames"

const userDashboardComponents = {
  sales: UserSales,
  ["offers-received"]: UserOffersReceived,
  ["offers-sent"]: UserOffersSent,
  activity: UserActions,
}
export const userDashboardComponentsKeys = Object.keys(userDashboardComponents)

export type DashboardTabsKey =
  | "sales"
  | "offers-received"
  | "offers-sent"
  | "activity"
interface UserDashboardProps {
  user: User
  activeTab: DashboardTabsKey
}
const _UserDashboard = ({ user, activeTab }: UserDashboardProps) => {
  const tabs = useMemo(
    () => [
      {
        key: "sales",
        name: "sales",
        props: {
          scroll: false,
          href: `${getUserProfileLink(user)}/dashboard/sales`,
        },
      },
      {
        key: "offers-received",
        name: "offers (received)",
        props: {
          scroll: false,
          href: `${getUserProfileLink(user)}/dashboard/offers-received`,
        },
      },
      {
        key: "offers-sent",
        name: "offers (sent)",
        props: {
          scroll: false,
          href: `${getUserProfileLink(user)}/dashboard/offers-sent`,
        },
      },
      {
        key: "activity",
        name: "activity",
        props: {
          scroll: false,
          href: `${getUserProfileLink(user)}/dashboard/activity`,
        },
      },
    ],
    [user]
  )
  const TabChildComponent = useMemo(
    () => userDashboardComponents[activeTab],
    [activeTab]
  )
  return (
    <div className={cs(style.container, layout["padding-big"])}>
      <Tabs
        tabDefinitions={tabs}
        activeIdx={activeTab}
        checkIsTabActive={checkIsTabKeyActive}
        tabsLayout="subtabs"
        tabWrapperComponent={LinkTabWrapper}
      />
      {TabChildComponent && <TabChildComponent user={user} />}
    </div>
  )
}
_UserDashboard.defaultProps = {
  activeTab: "sales",
}

export const UserDashboard = memo(_UserDashboard)
