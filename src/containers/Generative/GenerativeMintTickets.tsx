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

const ITEMS_PER_PAGE = 30
type MintTicketsBySection = {
  auctionTickets: MintTicket[]
  unusedTickets: MintTicket[]
}
type GenerativeTokenWithUserMintTickets = GenerativeToken & {
  loggedUserMintTickets: MintTicket[]
}
interface GenerativeMintTicketsProps {
  tokenId: number
}
const _GenerativeMintTickets = ({ tokenId }: GenerativeMintTicketsProps) => {
  const [hasNoMintTicketsToFetch, setHasNoMintTicketsToFetch] = useState(false)
  const { user } = useContext(UserContext)
  const now = useMemo(() => new Date(), [])
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
  })

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
      },
    })
    if (
      !newData?.generativeToken.mintTickets?.length ||
      newData.generativeToken.mintTickets.length < ITEMS_PER_PAGE
    ) {
      setHasNoMintTicketsToFetch(true)
    }
  }, [loading, hasNoMintTicketsToFetch, fetchMore, mintTickets?.length])

  const mintTicketsBySection = useMemo<MintTicketsBySection>(() => {
    const now = new Date()
    return mintTickets.reduce(
      (acc, ticket) => {
        if (isBefore(now, new Date(ticket.taxationPaidUntil))) {
          if (ticket.owner.id !== user?.id) {
            acc.unusedTickets.push(ticket)
          }
        } else {
          acc.auctionTickets.push(ticket)
        }
        return acc
      },
      {
        auctionTickets: [],
        unusedTickets: [],
      } as MintTicketsBySection
    )
  }, [mintTickets, user?.id])
  return (
    <div className={style.container}>
      {userMintTickets.length > 0 && (
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
            mintTickets={mintTicketsBySection.auctionTickets}
            loading={loading && mintTicketsBySection.unusedTickets.length === 0}
            refreshEveryMs={15000}
          />
        </div>
      )}
      <div>
        <InfiniteScrollTrigger
          onTrigger={handleFetchMoreTickets}
          canTrigger={!hasNoMintTicketsToFetch}
        >
          <TableMintTickets
            firstColName="Unused tickets"
            mintTickets={mintTicketsBySection.unusedTickets}
            loading={loading}
            refreshEveryMs={60000}
          />
        </InfiniteScrollTrigger>
      </div>
    </div>
  )
}

export const GenerativeMintTickets = memo(_GenerativeMintTickets)
