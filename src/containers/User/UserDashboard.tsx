import React, { memo, useMemo } from 'react';
import { LinkTabWrapper, Tabs } from "../../components/Layout/Tabs";
import style from "./UserDashboard.module.scss";
import { UserSalesTable } from "./UserSalesTable";
import { Spacing } from "../../components/Layout/Spacing";
import { UserActions } from "./UserActions";
import { getUserProfileLink } from "../../utils/user";
import { User } from "../../types/entities/User";


interface UserDashboardProps {
  user: User
}
const _UserDashboard = ({ user }: UserDashboardProps) => {
  const tabs = useMemo(() => [
    {
      name: "Sales",
      props: {
        href: `${getUserProfileLink(user)}/dashboard/sales`
      }
    },
    {
      name: "Offers (received)",
      props: {
        href: `${getUserProfileLink(user)}/dashboard/offers-received`
      }
    },
    {
      name: "Offers (sent)",
      props: {
        href: `${getUserProfileLink(user)}/dashboard/offers-sent`
      }
    },
    {
      name: "Activity",
      props: {
        href: `${getUserProfileLink(user)}/dashboard/activity`
      }
    },
  ], [user]);
  return (
    <div className={style.container}>
      <Tabs
        tabDefinitions={tabs}
        activeIdx={0}
        tabsLayout="subtabs"
        tabWrapperComponent={LinkTabWrapper}
      />
      <UserSalesTable user={user} />
      <Spacing size="5x-large" />
      <UserActions user={user}/>
    </div>
  );
};

export const UserDashboard = memo(_UserDashboard);
