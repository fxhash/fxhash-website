import { useLazyQuery } from "@apollo/client"
import { createMintTicketAlert } from "components/Alerts/MintTicketAlert"
import { createOfferAlert } from "components/Alerts/OfferAlert"
import { IMessageSent, MessageCenterContext } from "context/MessageCenter"
import { ISettingsContext, SettingsContext } from "context/Theme"
import { Qu_userAlerts } from "queries/user"
import { useContext, useEffect } from "react"
import { ConnectedUser } from "types/entities/User"
import { setCursor, shouldAlert } from "utils/alerts"

const createAlerts = (
  user: ConnectedUser,
  settings: ISettingsContext,
  data: any
) => {
  // set alert cursor to ensure we don't alert again for 24 hours
  setCursor(user.id, "alert-cursor")

  return [
    createMintTicketAlert(user, settings, data.user.mintTickets),
    createOfferAlert(user, settings, data.user.offersReceived),
  ].filter((alert) => alert !== null) as IMessageSent[]
}

export const useUserAlerts = (user: ConnectedUser | null) => {
  const settings = useContext(SettingsContext)
  const messageCenter = useContext(MessageCenterContext)
  const [getUserAlertsData] = useLazyQuery(Qu_userAlerts)

  useEffect(() => {
    // if no user or already alerted in past 24h, do nothing
    if (!user || !shouldAlert(user.id)) return

    const notify = async () => {
      const { data } = await getUserAlertsData({ variables: { id: user.id } })
      messageCenter.addMessages(createAlerts(user, settings, data))
    }

    notify()
  }, [user])
}
