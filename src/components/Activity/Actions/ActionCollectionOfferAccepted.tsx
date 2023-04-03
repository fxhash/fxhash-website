import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import { DisplayTezos } from "../../Display/DisplayTezos"

export const ActionCollectionOfferAccepted: TActionComp = ({
  action,
  verbose,
}) => {
  return (
    <>
      <UserBadge
        className={cs(style.user)}
        hasLink={true}
        user={action.target!}
        size="small"
      />
      <>collection offer of</>
      <span className={cs(style.price)}>
        <DisplayTezos
          formatBig={false}
          mutez={action.numericValue}
          tezosSize="regular"
        />
      </span>
      <>
        on{" "}
        <strong>
          {verbose ? action.objkt!.name : `#${action.objkt!.iteration}`}
        </strong>
      </>
      <>accepted by</>
      <UserBadge
        className={cs(style.user)}
        hasLink={true}
        user={action.issuer!}
        size="small"
      />
    </>
  )
}
