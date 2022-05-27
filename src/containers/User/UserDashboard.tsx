import React, { memo, useMemo } from 'react';
import { checkIsTabKeyActive, LinkTabWrapper, Tabs } from "../../components/Layout/Tabs";
import style from "./UserDashboard.module.scss";
import { UserSalesTable } from "./UserSalesTable";
import { UserActions } from "./UserActions";
import { getUserProfileLink } from "../../utils/user";
import { User } from "../../types/entities/User";

export const userDashboardComponents = {
  sales: UserSalesTable,
  ['offers-received']: UserSalesTable,
  ['offers-sent']: UserSalesTable,
  activity: UserActions,
}

interface UserDashboardProps {
  user: User
  activeTab: 'sales' | 'offers-received' | 'offers-sent' | 'activity'
}
const _UserDashboard = ({ user, activeTab }: UserDashboardProps) => {
  const tabs = useMemo(() => [
    {
      key: 'sales',
      name: "Sales",
      props: {
        href: `${getUserProfileLink(user)}/dashboard/sales`
      }
    },
    {
      key: 'offers-received',
      name: "Offers (received)",
      props: {
        href: `${getUserProfileLink(user)}/dashboard/offers-received`
      }
    },
    {
      key: 'offers-sent',
      name: "Offers (sent)",
      props: {
        href: `${getUserProfileLink(user)}/dashboard/offers-sent`
      }
    },
    {
      key: 'activity',
      name: "Activity",
      props: {
        href: `${getUserProfileLink(user)}/dashboard/activity`
      }
    },
  ], [user]);
  const TabChildComponent = useMemo(() => userDashboardComponents[activeTab], [activeTab])
  return (
    <div className={style.container}>
      <Tabs
        tabDefinitions={tabs}
        activeIdx={activeTab}
        checkIsTabActive={checkIsTabKeyActive}
        tabsLayout="subtabs"
        tabWrapperComponent={LinkTabWrapper}
      />
      {TabChildComponent && <TabChildComponent user={user} />}
    </div>
  );
};
_UserDashboard.defaultProps = {
  activeTab: 'sales'
}

export const UserDashboard = memo(_UserDashboard);
