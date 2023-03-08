import React, { memo, useCallback, useMemo, useState } from "react"
import { User } from "../../types/entities/User"
import { useQuery } from "@apollo/client"
import { Qu_userSales } from "../../queries/user"
import { TableUserSales } from "../../components/Tables"

interface UserSalesTableProps {
  user: User
}

const ITEMS_PER_PAGE = 30

const _UserSalesTable = ({ user }: UserSalesTableProps) => {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)
  const { data, loading, fetchMore } = useQuery<{ user: User }>(Qu_userSales, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
    },
    onCompleted: (newData) => {
      if (
        !newData?.user?.sales?.length ||
        newData.user.sales.length < ITEMS_PER_PAGE
      ) {
        setHasNothingToFetch(true)
      }
    },
  })
  const sales = useMemo(() => data?.user?.sales || [], [data?.user?.sales])
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        skip: sales.length,
        take: ITEMS_PER_PAGE,
      },
    })
    if (
      !newData?.user?.sales?.length ||
      newData.user.sales.length < ITEMS_PER_PAGE
    ) {
      setHasNothingToFetch(true)
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
  )
}

export const UserSales = memo(_UserSalesTable)
