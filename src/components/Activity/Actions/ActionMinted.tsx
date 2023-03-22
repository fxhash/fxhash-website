import { UserBadge } from "../../User/UserBadge"
import { TActionComp } from "./Action"
import style from "../Action.module.scss"
import cs from "classnames"

export const ActionMinted: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <>
      published <strong>{action.token!.name}</strong>
    </>
  </>
)
