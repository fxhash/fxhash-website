import React, { memo, useCallback, useMemo, useState } from 'react';
import { User } from "../../types/entities/User";
import { useQuery } from "@apollo/client";
import { Qu_userSales } from "../../queries/user";
import { TableUserSales } from "../../components/Tables";

interface UserSalesTableProps {
  user: User
}

const ITEMS_PER_PAGE = 30

const _UserSalesTable = ({ user }: UserSalesTableProps) => {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false);
  const { data, loading, fetchMore } = useQuery<{ user: User }>(Qu_userSales, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
    },
  })
  const sales = useMemo(() => data?.user?.sales || [], [data?.user?.sales])
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false;
    const { data } = await fetchMore({
      variables: {
        skip: sales.length,
        take: ITEMS_PER_PAGE
      },
    });
    if (!(data?.user.sales.length > 0)) {
      setHasNothingToFetch(true);
    }
  }, [loading, hasNothingToFetch, fetchMore, sales.length])
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
