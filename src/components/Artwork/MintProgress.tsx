import style from "./MintProgress.module.scss"
import colors from "./../../styles/Colors.module.css"
import cs from "classnames"
import { PropsWithChildren, useContext, useMemo } from "react"
import { SettingsContext } from "../../context/Theme"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { UserContext } from "../../containers/UserProvider"
import { reserveEligibleAmount } from "../../utils/generative-token"
import { User } from "../../types/entities/User"

interface Props {
  token: GenerativeToken
  showReserve?: boolean
}
export function MintProgress({
  token,
  showReserve = false,
  children,
}: PropsWithChildren<Props>) {
  const settings = useContext(SettingsContext)
  const { user } = useContext(UserContext)

  const { balance, supply, originalSupply } = token

  // number of iterations minted
  const minted = supply - balance
  const complete = balance === 0

  const [progress, burntProgress, reserveSize, reserveProgress] = useMemo<
    [number, number, number, number]
  >(() => {
    const visibleSupply = settings.displayBurntCard ? originalSupply : supply
    const progress = minted / visibleSupply
    const burnt = originalSupply - supply
    const burntProgress = settings.displayBurntCard ? burnt / originalSupply : 0
    const reserveSize = token.reserves
      ? token.reserves.reduce((a, b) => a + b.amount, 0)
      : 0
    const reserveProgress = Math.min(1, reserveSize / visibleSupply)
    return [progress, burntProgress, reserveSize, reserveProgress]
  }, [settings])

  // compute how many editions in reserve the user is eligible for
  const eligibleFor = useMemo(
    () => (user ? reserveEligibleAmount(user as User, token) : 0),
    [user, token]
  )

  return (
    <div className={cs(style.container)}>
      <span
        className={cs(style.infos, {
          [style.minted]: complete,
        })}
      >
        <span>
          <strong className={cs(colors.secondary)}>{minted}</strong>/{supply}{" "}
          minted
          {complete && <i aria-hidden className="fas fa-check-circle" />}
        </span>
        {children}
      </span>
      <div className={cs(style.progress)}>
        <div
          className={cs(style.bar)}
          style={{
            width: progress * 100 + "%",
          }}
        />
        {!complete && (
          <div
            className={cs(style.bar_reserve)}
            style={{
              left: progress * 100 + "%",
              width: reserveProgress * 100 + "%",
            }}
          />
        )}
        <div
          className={cs(style.bar_burnt)}
          style={{
            width: burntProgress * 100 + "%",
          }}
        />
      </div>
      {showReserve && reserveSize > 0 && (
        <div className={cs(style.reserve_text)}>
          <span>{reserveSize} reserved</span>
          {eligibleFor > 0 && (
            <strong>You are eligible for {eligibleFor}</strong>
          )}
        </div>
      )}
    </div>
  )
}
