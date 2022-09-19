import style from "./WalletBalance.module.scss"
import cs from "classnames"
import { useContext } from "react"
import { UserContext } from "../../containers/UserProvider"
import { useWalletBalance } from "../../hooks/useWalletBalance"
import { DisplayTezos } from "../Display/DisplayTezos"
import { Loader } from "../Utils/Loader"

interface Props {}
export function WalletBalance({}: Props) {
  const userCtx = useContext(UserContext)
  const { balance, loading } = useWalletBalance(userCtx)

  return (
    <div className={cs(style.root)}>
      {balance !== null && <DisplayTezos mutez={balance} tezosSize="regular" />}
      {loading && (
        <Loader size="tiny" color="gray-light" className={cs(style.loader)} />
      )}
    </div>
  )
}
