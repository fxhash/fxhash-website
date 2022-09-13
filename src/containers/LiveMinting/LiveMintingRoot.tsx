import { PropsWithChildren } from "react"
import { LiveMintingWalletGuard } from "../../components/LiveMinting/WalletGuard"
import { LiveMintingProvider } from "../../context/LiveMinting"
import { LiveMintingGuard } from "./LiveMintingGuard"

type Props = PropsWithChildren<{
}>
export function LiveMintingRoot({
  children,
}: Props) {
  return (
    <LiveMintingProvider>
      <LiveMintingGuard>
        <LiveMintingWalletGuard>
          {children}
        </LiveMintingWalletGuard>
      </LiveMintingGuard>
    </LiveMintingProvider>
  )
}