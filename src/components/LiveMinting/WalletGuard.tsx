import { PropsWithChildren, useContext } from "react"
import { UserContext } from "../../containers/UserProvider"
import { ConnectWallet } from "./ConnectWallet"
import { LiveMintingWalletBalance } from "./WalletBalance"
import { LiveMintingContext } from "context/LiveMinting"
import { useRouter } from "next/router"
import { LIVE_MINTING_FULLSCREEN_ROUTES } from "containers/LiveMinting/LiveMintingLayout"

type Props = PropsWithChildren<{}>
export function LiveMintingWalletGuard({ children }: Props) {
  const router = useRouter()
  const userCtx = useContext(UserContext)
  const { paidLiveMinting } = useContext(LiveMintingContext)

  return userCtx.user ? (
    <>
      {paidLiveMinting &&
        !LIVE_MINTING_FULLSCREEN_ROUTES.includes(router.pathname) && (
          <LiveMintingWalletBalance />
        )}
      {children}
    </>
  ) : (
    <ConnectWallet />
  )
}
