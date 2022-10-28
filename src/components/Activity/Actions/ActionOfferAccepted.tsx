import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import { DisplayTezos } from "../../Display/DisplayTezos"

export const ActionOfferAccepted: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.target!}
      size="small"
    />
    <span>offer of</span>
    <span className={cs(style.price)}>
      <DisplayTezos
        formatBig={false}
        mutez={action.numericValue}
        tezosSize="regular"
      />
    </span>
    <span>
      on{" "}
      <strong>
        {verbose ? action.objkt!.name : `#${action.objkt!.iteration}`}
      </strong>
    </span>
    <span>accepted by</span>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
  </>
)
