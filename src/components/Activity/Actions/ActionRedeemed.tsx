import { UserBadge } from "../../User/UserBadge"
import { TActionComp } from "./Action"
import style from "../Action.module.scss"
import cs from "classnames"
import { useQuery } from "@apollo/client"
import { Qu_redeemableBase } from "queries/events/redeemable"
import { eventsClient } from "services/EventsClient"
import { RedeemableDetails } from "types/entities/Redeemable"

export const ActionRedeemed: TActionComp = ({ action, verbose }) => {
  const { data, loading } = useQuery(Qu_redeemableBase, {
    client: eventsClient,
    variables: {
      where: {
        address: action.redeemable!.address,
      },
    },
  })
  const redeemable: RedeemableDetails | null = data?.consumable

  return (
    <>
      <UserBadge
        className={cs(style.user)}
        hasLink={true}
        user={action.issuer!}
        size="small"
      />
      <>
        <span>redeemed </span>
        {verbose ? (
          <strong>{action.objkt!.name}</strong>
        ) : (
          <strong>#{action.objkt!.iteration}</strong>
        )}
        <span>
          {" "}
          for <strong>{redeemable?.name || action.redeemable!.address}</strong>
        </span>
      </>
    </>
  )
}
