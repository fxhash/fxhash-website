import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import { DisplayTezos } from "../../Display/DisplayTezos"

export const ActionCollectionOfferCancelled: TActionComp = ({
  action,
  verbose,
}) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>cancelled</span>
    <span className={cs(style.price)}>
      <DisplayTezos
        formatBig={false}
        mutez={action.numericValue}
        tezosSize="regular"
      />
    </span>
    <span>
      collection offer for{" "}
      <strong>{verbose ? action.token!.name : `#${action.token!.id}`}</strong>
    </span>
  </>
)
