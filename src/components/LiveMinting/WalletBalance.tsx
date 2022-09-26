import style from "./WalletBalance.module.scss"
import cs from "classnames"
import { WalletBalance } from "../User/WalletBalance"

interface Props {}
export function LiveMintingWalletBalance({}: Props) {
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.wrapper)}>
        <span>Wallet balance:</span>
        <span className={cs(style.balance)}>
          <WalletBalance />
        </span>
      </div>
    </div>
  )
}
