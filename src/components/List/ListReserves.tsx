import style from "./ListReserves.module.scss"
import text from "../../styles/Colors.module.css"
import cs from "classnames"
import { IReserve } from "../../types/entities/Reserve"
import { useContext, useMemo } from "react"
import {
  getReservesAmount,
  reserveEligibleAmount,
} from "../../utils/generative-token"
import { ToggableInfo } from "../Layout/ToggableInfo"
import { Reserve } from "../GenerativeToken/Reserves/Reserve"
import { UserContext } from "../../containers/UserProvider"
import { User } from "../../types/entities/User"
import { GenerativeToken } from "../../types/entities/GenerativeToken"

interface Props {
  reserves: IReserve[]
  token?: GenerativeToken
  toggled?: boolean
}
export function ListReserves({ reserves, token, toggled }: Props) {
  const { user } = useContext(UserContext)
  const total = useMemo(() => getReservesAmount(reserves), [reserves])

  // how many eligible to user ?
  const eligibleAmount = useMemo(
    () => (token && user ? reserveEligibleAmount(user as User, token) : 0),
    [token, user]
  )

  return (
    <ToggableInfo
      label="Reserves"
      placeholder={
        <span>
          ({total})
          {eligibleAmount > 0 && (
            <strong className={cs(text.success)}>
              {" —"} you are eligible for {eligibleAmount}
            </strong>
          )}
        </span>
      }
      toggled={toggled}
    >
      <div className={cs(style.reserves)}>
        {reserves.map((reserve, idx) => (
          <Reserve key={idx} reserve={reserve} />
        ))}
      </div>
    </ToggableInfo>
  )
}
