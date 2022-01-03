import style from "./MintProgress.module.scss"
import colors from "./../../styles/Colors.module.css"
import cs from "classnames"
import { PropsWithChildren, useContext, useMemo } from "react"
import { SettingsContext } from "../../context/Theme"

interface Props {
  balance: number
  supply: number
  originalSupply: number
}

export function MintProgress({
  balance,
  supply,
  originalSupply,
  children,
}: PropsWithChildren<Props>) {
  const settings = useContext(SettingsContext)

  const minted = supply - balance
  const complete = balance === 0

  const [progress, burntProgress] = useMemo<[number, number]>(() => {
    const progress = minted / (settings.displayBurntCard ? originalSupply : supply)
    const burnt = originalSupply - supply
    const burntProgress = settings.displayBurntCard ? (burnt / originalSupply) : 0
    return [ progress, burntProgress ]
  }, [settings])

  return (
    <div className={cs(style.container)}>
      <span className={cs(style.infos, {
        [style.minted]: complete,
      })}>
        <span>
          <strong className={cs(colors.secondary)}>{minted}</strong>/{supply} minted 
          {complete && <i aria-hidden className="fas fa-check-circle"/>}
        </span>
        {children}
      </span>
      <div className={cs(style.progress)}>
        <div 
          className={cs(style.bar)}
          style={{
            width: progress*100 + '%'
          }}
        />
        <div 
          className={cs(style.bar_burnt)}
          style={{
            width: burntProgress*100 + '%'
          }}
        />
      </div>
    </div>
  )
}