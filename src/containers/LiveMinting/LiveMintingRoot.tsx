import { PropsWithChildren } from "react"
import { LiveMintingWalletGuard } from "../../components/LiveMinting/WalletGuard"
import { LiveMintingProvider } from "../../context/LiveMinting"

type Props = PropsWithChildren<{
}>
export function LiveMintingRoot({
  children,
}: Props) {
  return (
    <LiveMintingProvider>
      <LiveMintingWalletGuard>
        {children}
      </LiveMintingWalletGuard>
    </LiveMintingProvider>
  )
}