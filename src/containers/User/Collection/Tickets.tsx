import React, { memo, useCallback, useMemo, useState } from "react"
import cs from "classnames"
import { User } from "types/entities/User"
import { useQuery } from "@apollo/client"
import { Qu_userMintTickets } from "queries/user"
import layout from "styles/Layout.module.scss"
import { Spacing } from "components/Layout/Spacing"
import { TableMintTickets } from "components/Tables/TableMintTickets"
interface UserSalesTableProps {
  user: User
}

const ITEMS_PER_PAGE = 30

const UserCollectionTicketsTable = ({ user }: UserSalesTableProps) => {
  const { data, loading } = useQuery<{ user: User }>(Qu_userMintTickets, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
    },
  })
  const tickets = useMemo(
    () => data?.user?.mintTickets.map((t) => ({ ...t, owner: user })) || [],
    [data?.user?.mintTickets]
  )
  return (
    <div className={cs(layout["padding-big"])}>
      <Spacing size="x-large" />
      <TableMintTickets
        loading={loading}
        mintTickets={tickets}
        firstColName="Token"
        displayTokenPreview
        refreshEveryMs={60000}
      />
    </div>
  )
}

export const UserCollectionTickets = memo(UserCollectionTicketsTable)
