import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import colors from "../../../styles/Colors.module.css"

export const ActionBurnSupply: TActionComp = ({ action }) => {
  const metadata = action.metadata
  return (
    <>
      <UserBadge
        className={cs(style.user)}
        hasLink={true}
        user={action.issuer!}
        size="small"
      />
      <>burnt some supply:</>
      <>
        <strong className={cs(colors.secondary)}>{metadata.from}</strong>
        {" -> "}
        <strong className={cs(colors.secondary)}>{metadata.to}</strong>
      </>
    </>
  )
}
