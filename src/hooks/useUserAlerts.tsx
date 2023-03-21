import { useLazyQuery } from "@apollo/client"
import { IMessageSent, MessageCenterContext } from "context/MessageCenter"
import { addDays, isAfter, isBefore } from "date-fns"
import Link from "next/link"
import { Qu_userAlerts } from "queries/user"
import { useContext, useEffect } from "react"
import { MintTicket } from "types/entities/MintTicket"
import { Offer } from "types/entities/Offer"
import { ConnectedUser } from "types/entities/User"
import { getUserProfileLink } from "utils/user"

type CursorIdentifier = "alert-cursor" | "offer-cursor"

const setCursor = (userId: string, identifier: CursorIdentifier) => {
  // read cursors from local storage
  const fromStorage = localStorage.getItem(identifier)
  // if no cursors, create a new object
  const userCursors = fromStorage ? JSON.parse(fromStorage) : {}
  // set cursor for current user
  userCursors[userId] = new Date().toISOString()
  // save to local storage
  localStorage.setItem(identifier, JSON.stringify(userCursors))
}

const readCursor = (userId: string, identifier: CursorIdentifier) => {
  // read alert cursors from local storage
  const fromStorage = localStorage.getItem(identifier)
  // if no cursors, return true
  if (!fromStorage) return null
  // get cursor for current user
  return JSON.parse(fromStorage)[userId]
  // alert if cursor is older than 24 hours
}

const shouldAlert = (userId: string) => {
  const cursor = readCursor(userId, "alert-cursor")
  // if no cursor, return true
  if (!cursor) return true
  // alert if cursor is older than 24 hours
  return isAfter(new Date(), addDays(new Date(cursor), 1))
}

const createMintTicketAlert = (
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
    title: "Mint ticket alert",
    content: (onRemove: () => void) => (
      <>
        You have {expiringMintTickets.length} mint ticket(s) with taxation
        periods expiring in the next 48 hours.{" "}
        <Link
          legacyBehavior
          href={`${getUserProfileLink(user)}/collection/tickets`}
        >
          <a onClick={onRemove}>See my tickets</a>
        </Link>
      </>
    ),
    keepAlive: true,
  }
}

const createOfferAlert = (user: ConnectedUser, offers: Offer[]) => {
  // use a separate cursor to track when the last offer alert was sent
  const cursor = readCursor(user.id, "offer-cursor")
  // find offers created since the last alert
  const newOffers = offers.filter((offer) =>
    cursor ? isAfter(new Date(offer.createdAt), new Date(cursor)) : true
  )
  // if none, do nothing
  if (!newOffers.length) return null

  // set the user's offer cursor to the current time
  setCursor(user.id, "offer-cursor")

  return {
    type: "warning",
    title: "Offer alert",
    content: (onRemove: () => void) => (
      <>
        You have {newOffers.length} active offers.{" "}
        <Link
          legacyBehavior
          href={`${getUserProfileLink(user)}/dashboard/offers-received`}
        >
          <a onClick={onRemove}>See my offers</a>
        </Link>
      </>
    ),
    keepAlive: true,
  }
}

const createAlerts = (user: ConnectedUser, data: any) =>
  [
    createMintTicketAlert(user, data.user.mintTickets),
    createOfferAlert(user, data.user.offersReceived),
  ].filter((alert) => alert !== null) as IMessageSent[]

export const useUserAlerts = (user: ConnectedUser | null) => {
  const messageCenter = useContext(MessageCenterContext)
  const [getUserAlertsData] = useLazyQuery(Qu_userAlerts)

  useEffect(() => {
    // if no user or already alerted in past 24h, do nothing
    if (!user || !shouldAlert(user.id)) return

    const notify = async () => {
      const { data } = await getUserAlertsData({ variables: { id: user.id } })
      messageCenter.addMessages(createAlerts(user, data))
      setCursor(user.id, "alert-cursor")
    }

    notify()
  }, [user])
}
