import { MessageProps } from "components/MessageCenter/Message"
import { formatDistanceStrict, isAfter, isBefore } from "date-fns"
import Link from "next/link"
import { useState } from "react"
import { MintTicket } from "types/entities/MintTicket"
import { ConnectedUser } from "types/entities/User"
import { useInterval } from "utils/hookts"
import { getUserProfileLink } from "utils/user"

// add useInterval
const MintTicketAlert = ({
  user,
  expiringMintTickets,
  onRemove,
}: {
  user: ConnectedUser
  expiringMintTickets: MintTicket[]
  onRemove: MessageProps["onRemove"]
}) => {
  const expiringSoonest = expiringMintTickets.reduce((acc, mintTicket) =>
    isBefore(
      new Date(mintTicket.taxationPaidUntil),
      new Date(acc.taxationPaidUntil)
    )
      ? mintTicket
      : acc
  )

  const expiresIn = formatDistanceStrict(
    new Date(),
    new Date(expiringSoonest.taxationPaidUntil)
  )

  return (
    <>
      You have {expiringMintTickets.length} mint ticket(s) expiring soon - next
      expiration in {expiresIn}.{<br />}
      <Link
        legacyBehavior
        href={`${getUserProfileLink(user)}/collection/tickets`}
      >
        <a onClick={onRemove}>See my tickets</a>
      </Link>
    </>
  )
}

export const createMintTicketAlert = (
  user: ConnectedUser,
  mintTickets: MintTicket[]
) => {
  // find mint tickets with taxation period expiring in the next 48 hours
  const expiringMintTickets = mintTickets.filter(
    (mintTicket) => isAfter(new Date(mintTicket.taxationPaidUntil), new Date()) // &&
    // isBefore(new Date(mintTicket.taxationPaidUntil), addDays(new Date(), 2))
  )
  // if none, do nothing
  if (!expiringMintTickets.length) return null

  return {
    type: "warning",
    title: "Mint tickets expiring soon",
    content: (onRemove: MessageProps["onRemove"]) => (
      <MintTicketAlert
        user={user}
        expiringMintTickets={expiringMintTickets}
        onRemove={onRemove}
      />
    ),
    keepAlive: true,
  }
}
