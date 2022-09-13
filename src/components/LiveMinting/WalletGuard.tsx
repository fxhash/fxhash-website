import { PropsWithChildren, useContext } from "react"
import { UserContext } from "../../containers/UserProvider"
import { ConnectWallet } from "./ConnectWallet"
import { LiveMintingWalletBalance } from "./WalletBalance"

type Props = PropsWithChildren<{

}>
export function LiveMintingWalletGuard({
  children,
}: Props) {
  const userCtx = useContext(UserContext)

  return (
    userCtx.user ? (
      <>
        <LiveMintingWalletBalance/>
        {children}
      </>
    ): <ConnectWallet />
  )
}