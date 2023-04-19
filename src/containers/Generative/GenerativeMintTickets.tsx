import React, { memo, useCallback, useContext, useMemo, useState } from "react"
import { TableMintTickets } from "../../components/Tables/TableMintTickets"
import { isBefore } from "date-fns"
import { MintTicket } from "../../types/entities/MintTicket"
import { UserContext } from "../UserProvider"
import style from "./GenerativeMintTickets.module.scss"
import { useQuery } from "@apollo/client"
import { Qu_genTokenMintTickets } from "../../queries/generative-token"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { Select } from "components/Input/Select"
import { useQueryParamSort } from "hooks/useQueryParamSort"
import { sortOptionsMintTickets } from "utils/sort"

const ITEMS_PER_PAGE = 30

type GenerativeTokenWithUserMintTickets = GenerativeToken & {
  loggedUserMintTickets: MintTicket[]
}
interface GenerativeMintTicketsProps {
  tokenId: number
  showCurrentUserTickets?: boolean
  showGracePeriodTickets?: boolean
}
const _GenerativeMintTickets = ({
  tokenId,
  showCurrentUserTickets = true,
  showGracePeriodTickets = true,
}: GenerativeMintTicketsProps) => {
  const [hasNoMintTicketsToFetch, setHasNoMintTicketsToFetch] = useState(false)
  const { user } = useContext(UserContext)
  const now = useMemo(() => new Date(), [])

  const { sortValue, setSortValue, sortVariable, sortOptions } =
    useQueryParamSort(sortOptionsMintTickets)

  const { data, loading, fetchMore } = useQuery<{
    generativeToken: GenerativeTokenWithUserMintTickets
    userMintTickets: MintTicket[]
  }>(Qu_genTokenMintTickets, {
    variables: {
      id: tokenId,
      ownerId: user ? user.id : "not-logged",
      skip: 0,
      take: ITEMS_PER_PAGE,
      now: now.toISOString(),
      sort: sortVariable,
      filters: !showGracePeriodTickets
        ? {
            underAuction_eq: false,
            inGracePeriod_eq: false,
          }
        : {
            underAuction_eq: false,
          },
    },
    onCompleted: (newData) => {
      if (
        !newData?.generativeToken.mintTickets?.length ||
        newData.generativeToken.mintTickets.length < ITEMS_PER_PAGE
      ) {
        setHasNoMintTicketsToFetch(true)
      }
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-only",
  })

  console.log(data)

  const underAuctionMintTickets = useMemo(
    () => data?.generativeToken?.underAuctionMintTickets || [],
    [data?.generativeToken]
  )

  const mintTickets = useMemo(
    () => data?.generativeToken?.mintTickets || [],
    [data?.generativeToken]
  )
  const userMintTickets = useMemo(
    () => data?.userMintTickets || [],
    [data?.userMintTickets]
  )

  const handleFetchMoreTickets = useCallback(async () => {
    if (loading || hasNoMintTicketsToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        skip: mintTickets?.length,
        take: ITEMS_PER_PAGE,
        sort: sortVariable,
      },
    })
    if (
      !newData?.generativeToken.mintTickets?.length ||
      newData.generativeToken.mintTickets.length < ITEMS_PER_PAGE
    ) {
      setHasNoMintTicketsToFetch(true)
    }
  }, [loading, hasNoMintTicketsToFetch, fetchMore, mintTickets?.length])

  return (
    <div className={style.container}>
      {showCurrentUserTickets && userMintTickets.length > 0 && (
        <div>
          <TableMintTickets
            firstColName="Your tickets"
            mintTickets={userMintTickets}
            loading={loading}
            refreshEveryMs={60000}
          />
        </div>
      )}
      {(!loading || mintTickets.length > 0) && (
        <div>
          <TableMintTickets
            firstColName="Under auction (holder failed to pay tax)"
            mintTickets={underAuctionMintTickets}
            loading={loading && underAuctionMintTickets.length === 0}
            refreshEveryMs={15000}
          />
        </div>
      )}
      <div className={style.top_bar}>
        <Select
          className={style.select}
          classNameRoot={style.select_root}
          value={sortValue}
          options={sortOptions}
          onChange={setSortValue}
        />
      </div>
      <div>
        <InfiniteScrollTrigger
          onTrigger={handleFetchMoreTickets}
          canTrigger={!hasNoMintTicketsToFetch}
        >
          <TableMintTickets
            firstColName="Unused tickets"
            mintTickets={mintTickets}
            loading={loading}
            refreshEveryMs={60000}
            updateCacheOnForeclosure
          />
        </InfiniteScrollTrigger>
      </div>
    </div>
  )
}

export const GenerativeMintTickets = memo(_GenerativeMintTickets)
