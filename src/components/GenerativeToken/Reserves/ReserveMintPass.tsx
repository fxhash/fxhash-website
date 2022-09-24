import cs from "classnames"
import style from "./ReserveMintPass.module.scss"
import { TRenderReserveComponent } from "./Reserve"
import { useQuery } from "@apollo/client"
import { Qu_eventMintPassGroup } from "../../../queries/events/events"
import { eventsClient } from "../../../services/EventsClient"
import { LiveMintingPassGroup } from "../../../types/entities/LiveMinting"


export const ReserveMintPass: TRenderReserveComponent = ({
  reserve,
}) => {
  const { data } = useQuery(Qu_eventMintPassGroup, {
    client: eventsClient,
    variables: {
      where: {
        address: reserve.data
      }
    },
    fetchPolicy: "cache-first"
  })

  const mintPassGroup: LiveMintingPassGroup | null = data?.mintPassGroup || null

  return (
    <div>
      {mintPassGroup
        ? (
          <>
            {mintPassGroup.event.name} - <em>{mintPassGroup.label}</em>
          </>
        )
        : reserve.data
      }
    </div>
  )
}