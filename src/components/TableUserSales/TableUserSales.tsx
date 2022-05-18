import React, { memo } from 'react';
import { Action } from "../../types/entities/Action";
import useWindowSize, { breakpoints } from "../../hooks/useWindowsSize";
import { TableUserSalesDesktop } from "./TableUserSalesDesktop";
import { TableUserSalesMobile } from "./TableUserSalesMobile";
import { User } from '../../types/entities/User';

interface TableUserSalesProps {
  user: User,
  sales: Action[],
  loading?: boolean,
}
const _TableUserSales = ({ user, sales, loading }: TableUserSalesProps) => {
  const { width } = useWindowSize();
  // todo infinite scroll
  // todo virtualize table
  return width !== undefined && width < breakpoints.sm ?
    <TableUserSalesMobile sales={sales} loading={loading} />
    : <TableUserSalesDesktop user={user} sales={sales} loading={loading} />
};

export const TableUserSales = memo(_TableUserSales);
