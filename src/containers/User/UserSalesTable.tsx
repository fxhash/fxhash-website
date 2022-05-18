import React, { memo } from 'react';
import style from "./UserSalesTable.module.scss";
import { User } from "../../types/entities/User";
import cs from "classnames";
import { useQuery } from "@apollo/client";
import { Qu_userSales } from "../../queries/user";
import TableUserSales from "../../components/TableUserSales";

interface UserSalesTableProps {
  user: User
}

const _UserSalesTable = ({ user }: UserSalesTableProps) => {
  const { data, loading } = useQuery(Qu_userSales, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
    }
  })
  const sales = data?.user?.sales || [];
  return (
    <div className={cs(style.sales)}>
      <h5 className={cs(style.title)}>Sales</h5>
      <TableUserSales user={user} loading={loading} sales={sales} />
    </div>
  );
};

export const UserSalesTable = memo(_UserSalesTable);
