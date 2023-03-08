import React, { memo, useContext, useMemo } from "react"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { TableMintTickets } from "../../components/Tables/TableMintTickets"
import { isBefore } from "date-fns"
import { MintTicket } from "../../types/entities/MintTicket"
import { UserContext } from "../UserProvider"
import style from "./GenerativeMintTickets.module.scss"

type MintTicketsBySection = {
  userValidTickets: MintTicket[]
  auctionTickets: MintTicket[]
  unusedTickets: MintTicket[]
}
interface GenerativeMintTicketsProps {
  token: GenerativeToken
}
const _GenerativeMintTickets = ({ token }: GenerativeMintTicketsProps) => {
  const { user } = useContext(UserContext)
  const mintTicketsBySection = useMemo<MintTicketsBySection>(() => {
    const now = new Date()
    return token.mintTickets.reduce(
      (acc, ticket) => {
        if (isBefore(now, new Date(ticket.taxationPaidUntil))) {
          if (ticket.owner.id === user?.id) {
            acc.userValidTickets.push(ticket)
          } else {
            acc.unusedTickets.push(ticket)
          }
        } else {
          acc.auctionTickets.push(ticket)
        }
        return acc
      },
      {
        userValidTickets: [],
        auctionTickets: [],
        unusedTickets: [],
      } as MintTicketsBySection
    )
  }, [token.mintTickets, user?.id])
  return (
    <div className={style.container}>
      {mintTicketsBySection.userValidTickets.length > 0 && (
        <div>
          <TableMintTickets
            firstColName="Your tickets"
            mintTickets={mintTicketsBySection.userValidTickets}
          />
        </div>
      )}
      <div>
        <TableMintTickets
          firstColName="Under auction (holder failed to pay tax)"
          mintTickets={mintTicketsBySection.auctionTickets}
        />
      </div>
      <div>
        <TableMintTickets
          firstColName="Unused passes"
          mintTickets={mintTicketsBySection.unusedTickets}
        />
      </div>
    </div>
  )
}

export const GenerativeMintTickets = memo(_GenerativeMintTickets)
