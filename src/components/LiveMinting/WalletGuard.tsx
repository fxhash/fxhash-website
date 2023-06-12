import { PropsWithChildren, useContext } from "react"
import { UserContext } from "../../containers/UserProvider"
import { ConnectWallet } from "./ConnectWallet"
import { LiveMintingWalletBalance } from "./WalletBalance"
import { LiveMintingContext } from "context/LiveMinting"

type Props = PropsWithChildren<{}>
export function LiveMintingWalletGuard({ children }: Props) {
  const userCtx = useContext(UserContext)
  const { paidLiveMinting } = useContext(LiveMintingContext)

  return userCtx.user ? (
    <>
      {paidLiveMinting && <LiveMintingWalletBalance />}
      {children}
    </>
  ) : (
    <ConnectWallet />
  )
}
