import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import colors from "../../../styles/Colors.module.css"
import { displayRoyalties } from "../../../utils/units"

export const ActionUpdateState: TActionComp = ({ action }) => {
  const changes = action.metadata.changes
  return (
    <>
      <UserBadge
        className={cs(style.user)}
        hasLink={true}
        user={action.issuer!}
        size="small"
      />
      <span>updated state:</span>
      <span>
        {changes.enabled !== undefined && (
          <span>
            <strong
              className={cs(changes.enabled ? colors.success : colors.error)}
            >
              {changes.enabled ? "enabled" : "disabled"}
            </strong>
            {changes.royalties !== undefined ? ", " : ""}
          </span>
        )}
        {changes.royalties !== undefined && (
          <span>
            <strong className={cs(style.price)}>
              {displayRoyalties(changes.royalties)}
            </strong>{" "}
            royalties
          </span>
        )}
      </span>
    </>
  )
}
