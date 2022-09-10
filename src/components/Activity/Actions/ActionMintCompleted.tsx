import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import colors from "../../../styles/Colors.module.css"

export const ActionCompleted: TActionComp = ({ action }) => (
  <>
    <strong className={cs(colors.success)}>completed</strong>
    <span>—</span>
    <span>Generative Token fully minted</span>
  </>
)