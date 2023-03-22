import { MessageProps } from "components/MessageCenter/Message"
import { addDays, formatDistanceStrict, isAfter, isBefore } from "date-fns"
import { useIntervalValue } from "hooks/useIntervalValue"
import Link from "next/link"
import { MintTicket } from "types/entities/MintTicket"
import { ConnectedUser } from "types/entities/User"
import { getUserProfileLink } from "utils/user"

const MintTicketAlert = ({
  user,
  expiringMintTickets,
  onRemove,
}: {
  user: ConnectedUser
  expiringMintTickets: MintTicket[]
  onRemove: MessageProps["onRemove"]
}) => {
  // find the soonest expiring mint ticket
  const expiringSoonest = expiringMintTickets.reduce((acc, mintTicket) =>
    isBefore(
      new Date(mintTicket.taxationPaidUntil),
      new Date(acc.taxationPaidUntil)
    )
      ? mintTicket
      : acc
  )

  // update the countdown every minute
  const expiresIn = useIntervalValue(
    () =>
      formatDistanceStrict(
        new Date(),
        new Date(expiringSoonest.taxationPaidUntil)
      ),
    60 * 1000 // 60 seconds
  )

  return (
    <>
      You have <b>{expiringMintTickets.length}</b> mint ticket(s) expiring soon
      - next expiration in {expiresIn}.{<br />}
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
    (mintTicket) =>
      isAfter(new Date(mintTicket.taxationPaidUntil), new Date()) &&
      isBefore(new Date(mintTicket.taxationPaidUntil), addDays(new Date(), 2))
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
