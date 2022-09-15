import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import { DisplayTezos } from "../../Display/DisplayTezos"

export const ActionUpdatePrice: TActionComp = ({ action }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      updated price:
    </span>
    <span>
      <span className={cs(style.price)}>
        <DisplayTezos
          formatBig={false}
          mutez={action.metadata.from.price}
          tezosSize="regular"
        />
      </span>
      <span>{" -> "}</span>
      <span className={cs(style.price)}>
        <DisplayTezos
          formatBig={false}
          mutez={action.metadata.to.price}
          tezosSize="regular"
        />
      </span>
    </span>
  </>
)