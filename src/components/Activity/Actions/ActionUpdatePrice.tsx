import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import { DisplayTezos } from "../../Display/DisplayTezos"
import { DutchAuctionLevels } from "components/GenerativeToken/Pricing/DutchAuctionLevels"

export const ActionUpdatePrice: TActionComp = ({ action }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <>updated price:</>
    <>
      <span className={cs(style.price)}>
        {action.metadata.from.levels ? (
          <DutchAuctionLevels {...action.metadata.from} />
        ) : (
          <DisplayTezos
            formatBig={false}
            mutez={action.metadata.from.price}
            tezosSize="regular"
          />
        )}
      </span>
      <span>{" -> "}</span>
      <span className={cs(style.price)}>
        {action.metadata.to.levels ? (
          <DutchAuctionLevels {...action.metadata.to} />
        ) : (
          <DisplayTezos
            formatBig={false}
            mutez={action.metadata.to.price}
            tezosSize="regular"
          />
        )}
      </span>
    </>
  </>
)
