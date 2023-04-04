import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"

export const ActionClaimedTicket: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <>
      <span>claimed a ticket</span>
      {verbose && (
        <>
          <span>
            {" "}
            of <strong>{action.token!.name}</strong> from
          </span>
          <UserBadge
            className={cs(style.user)}
            hasLink={true}
            user={action.target!}
            size="small"
          />
        </>
      )}
    </>
  </>
)
