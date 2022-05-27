import React, { memo, useCallback, useMemo } from 'react';
import style from "./UserSales.module.scss";
import { User } from "../../types/entities/User";
import cs from "classnames";
import { useQuery } from "@apollo/client";
import { Qu_userSales } from "../../queries/user";
import { TableUserSales } from "../../components/Tables";

interface UserSalesTableProps {
  user: User
}

const ITEMS_PER_PAGE = 30

const _UserSalesTable = ({ user }: UserSalesTableProps) => {
  const { data, loading, fetchMore } = useQuery(Qu_userSales, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
    }
  })
  const sales = useMemo(() => data?.user?.sales || [], [data?.user?.sales])
  const handleFetchMore = useCallback(async () => {
    if (loading) return false;
    await fetchMore({
      variables: {
        skip: sales.length,
        take: ITEMS_PER_PAGE
      }
    });
  }, [loading, fetchMore, sales.length])
  return (
    <div>
      <TableUserSales
        loading={loading}
        sales={sales}
        onScrollToBottom={handleFetchMore}
      />
    </div>
  );
};

export const UserSales = memo(_UserSalesTable);
