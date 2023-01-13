import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"

export const ActionTransfered: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <>
      transfered{" "}
      <strong>#{verbose ? action.objkt!.name : action.objkt!.iteration}</strong>{" "}
      to
    </>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.target!}
      size="small"
    />
  </>
)
