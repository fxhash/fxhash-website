import { useLazyQuery } from "@apollo/client"
import { createMintTicketAlert } from "components/Alerts/MintTicketAlert"
import { createOfferAlert } from "components/Alerts/OfferAlert"
import { IMessageSent, MessageCenterContext } from "context/MessageCenter"
import { ISettingsContext, SettingsContext } from "context/Theme"
import { Qu_userDailyAlerts, Qu_userFrequentAlerts } from "queries/user"
import { useContext, useEffect } from "react"
import { ConnectedUser } from "types/entities/User"
import { setCursor, shouldSendDailyAlert } from "utils/alerts"

/**
 * alerts that are potentially sent multiple times per day - the createXAlert
 * handler should manage the frequency of alerts
 */
const createFrequentAlerts = (
  user: ConnectedUser,
  settings: ISettingsContext,
  data: any
) => {
  return [
    createOfferAlert(user, settings, data.user?.offersReceived || []),
    // ...other frequent alerts
  ].filter((alert) => alert !== null) as IMessageSent[]
}

/**
 * alerts that are only sent once per day
 */
const createDailyAlerts = (
  user: ConnectedUser,
  settings: ISettingsContext,
  data: any
) => {
  // set alert cursor to ensure we don't alert again for 24 hours
  setCursor(user.id, "alert-cursor")

  return [
    createMintTicketAlert(user, settings, data.user.mintTickets),
    // ...other daily alerts
  ].filter((alert) => alert !== null) as IMessageSent[]
}

export const useUserAlerts = (user: ConnectedUser | null) => {
  const settings = useContext(SettingsContext)
  const messageCenter = useContext(MessageCenterContext)
  const [getUserDailyAlerts] = useLazyQuery(Qu_userDailyAlerts)
  const [getUserFrequentAlerts] = useLazyQuery(Qu_userFrequentAlerts)

  useEffect(() => {
    // if no user, do nothing
    if (!user) return

    const notify = async () => {
      // always fetch data on user changed for frequent alerts
      const { data: frequentAlertsData } = await getUserFrequentAlerts({
        variables: { id: user.id },
      })

      // if we should send daily alerts, do so
      if (shouldSendDailyAlert(user.id)) {
        // fetch data for daily alerts
        const { data: dailyAlertsData } = await getUserDailyAlerts({
          variables: { id: user.id },
        })
        // send daily alerts
        messageCenter.addMessages(
          createDailyAlerts(user, settings, dailyAlertsData)
        )
      }

      // send frequent alerts
      messageCenter.addMessages(
        createFrequentAlerts(user, settings, frequentAlertsData)
      )
    }

    notify()
    // run whenever user changes
  }, [user?.id])
}
