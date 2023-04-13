import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import { DisplayTezos } from "components/Display/DisplayTezos"

export const ActionMintedTicket: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <>
      <span>minted a ticket</span>
      {verbose && (
        <span>
          {" "}
          of <strong>{action.token!.name}</strong>
        </span>
      )}
      <span>for </span>
      <span className={cs(style.price)}>
        <DisplayTezos
          formatBig={false}
          mutez={action.numericValue}
          tezosSize="regular"
        />
      </span>
    </>
  </>
)
