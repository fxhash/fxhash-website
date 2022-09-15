import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"

export const ActionMintedFrom: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      <span>minted </span>
      {verbose ? (
        <strong>{action.objkt!.name}</strong>
      ):(
        <strong>#{action.objkt!.iteration}</strong>
      )}
    </span>
  </>
)