import { useLazyQuery } from "@apollo/client"
import { createMintTicketAlert } from "components/Alerts/MintTicketAlert"
import { IMessageSent, MessageCenterContext } from "context/MessageCenter"
import { addDays, isAfter } from "date-fns"
import { Qu_userAlerts } from "queries/user"
import { useContext, useEffect } from "react"
import { ConnectedUser } from "types/entities/User"

const setAlertCursor = (userId: string) => {
  // read alert cursors from local storage
  const fromStorage = localStorage.getItem("alert-cursor")
  // if no cursors, create a new object
  const userCursors = fromStorage ? JSON.parse(fromStorage) : {}
  // set cursor for current user
  userCursors[userId] = new Date().toISOString()
  // save to local storage
  localStorage.setItem("alert-cursor", JSON.stringify(userCursors))
}

const shouldAlert = (userId: string) => {
  // read alert cursors from local storage
  const fromStorage = localStorage.getItem("alert-cursor")
  // if no cursors, return true
  if (!fromStorage) return true
  // get cursor for current user
  const cursor = JSON.parse(fromStorage)[userId]
  // alert if cursor is older than 24 hours
  return isAfter(new Date(), addDays(new Date(cursor), 1))
}

const createAlerts = (user: ConnectedUser, data: any) => {
  // setAlertCursor(user.id)

  return [
    createMintTicketAlert(user, data.user.mintTickets),
    // ... other alerts
  ].filter((alert) => alert !== null) as IMessageSent[]
}

export const useUserAlerts = (user: ConnectedUser | null) => {
  const messageCenter = useContext(MessageCenterContext)
  const [getUserAlertsData] = useLazyQuery(Qu_userAlerts)

  useEffect(() => {
    // if no user or already alerted in past 24h, do nothing
    if (!user || !shouldAlert(user.id)) return

    const notify = async () => {
      const { data } = await getUserAlertsData({ variables: { id: user.id } })
      messageCenter.addMessages(createAlerts(user, data))
    }

    notify()
  }, [user])
}
