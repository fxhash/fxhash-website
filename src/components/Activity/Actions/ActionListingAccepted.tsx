import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import { DisplayTezos } from "../../Display/DisplayTezos"

export const ActionListingAccepted: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      bought <strong>{verbose ? action.objkt!.name : `#${action.objkt!.iteration}`}</strong> from
    </span>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.target!}
      size="small"
    />
    <span>
      <span>for </span>
      <span className={cs(style.price)}>
        <DisplayTezos
          formatBig={false}
          mutez={action.numericValue}
          tezosSize="regular"
        />
      </span>
    </span>
  </>
)