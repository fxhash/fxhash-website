import React, { memo } from 'react';
import { Action } from "../../types/entities/Action";
import { TableUserSalesDesktop } from "./TableUserSalesDesktop";
import { User } from '../../types/entities/User';

interface TableUserSalesProps {
  user: User,
  sales: Action[],
  loading?: boolean,
}
const _TableUserSales = ({ user, sales, loading }: TableUserSalesProps) => {
  // todo virtualize table?
  return <TableUserSalesDesktop user={user} sales={sales} loading={loading} />
};

export const TableUserSales = memo(_TableUserSales);
