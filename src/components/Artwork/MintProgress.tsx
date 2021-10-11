import style from "./MintProgress.module.scss"
import colors from "./../../styles/Colors.module.css"
import cs from "classnames"

interface Props {
  balance: number
  supply: number
}

export function MintProgress({
  balance,
  supply
}: Props) {
  const minted = supply - balance
  const progress = minted / supply
  const complete = balance === 0

  return (
    <div className={cs(style.container)}>
      <span className={cs(style.infos, {
        [style.minted]: complete,
      })}>
        <strong className={cs(colors.secondary)}>{minted}</strong>/{supply} minted 
        {complete && <i className="fas fa-check-circle"/>}
      </span>
      <div className={cs(style.progress)}>
        <div 
          className={cs(style.bar)}
          style={{
            width: progress*100 + '%'
          }}
        />
      </div>
    </div>
  )
}