import React, { memo } from 'react';
import { Action } from "../../types/entities/Action";
import useWindowSize, { breakpoints } from "../../hooks/useWindowsSize";
import { TableUserSalesDesktop } from "./TableUserSalesDesktop";
import { TableUserSalesMobile } from "./TableUserSalesMobile";

interface TableUserSalesProps {
  sales: Action[],
  loading?: boolean,
}
const _TableUserSales = ({ sales, loading }: TableUserSalesProps) => {
  const { width } = useWindowSize();
  // todo infinite scroll
  // todo virtualize table
  return width !== undefined && width < breakpoints.sm ?
    <TableUserSalesMobile sales={sales} loading={loading} />
    : <TableUserSalesDesktop sales={sales} loading={loading} />
};

export const TableUserSales = memo(_TableUserSales);
