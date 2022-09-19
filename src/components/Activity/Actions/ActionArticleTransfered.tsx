import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"

export const ActionArticleEditionsTransfered: TActionComp = ({
  action,
  verbose,
}) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      transfered <strong>{action.numericValue}</strong> editions{" "}
      {verbose && (
        <>
          of <strong>{action.article!.title}</strong>
        </>
      )}{" "}
      to
    </span>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.target!}
      size="small"
    />
  </>
)
