import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import { DisplayTezos } from "../../Display/DisplayTezos"

export const ActionMintedFrom: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <>
      <span>minted </span>
      {verbose ? (
        <strong>{action.objkt!.name}</strong>
      ) : (
        <strong>#{action.objkt!.iteration}</strong>
      )}
      {action.ticketId ? (
        <span> with ticket</span>
      ) : (
        <>
          <span>for </span>
          <span className={cs(style.price)}>
            <DisplayTezos
              formatBig={false}
              mutez={action.numericValue}
              tezosSize="regular"
            />
          </span>
        </>
      )}
    </>
  </>
)
