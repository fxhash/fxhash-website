import { PropsWithChildren, useContext, useEffect } from "react"
import { LiveMintingWalletGuard } from "../../components/LiveMinting/WalletGuard"
import { LiveMintingProvider } from "../../context/LiveMinting"
import { MessageCenterContext } from "../../context/MessageCenter"
import { LiveMintingGuard } from "./LiveMintingGuard"

type Props = PropsWithChildren<{}>
export function LiveMintingRoot({ children }: Props) {
  // we hide the warnings in the message center to make a better flow
  const messageCenter = useContext(MessageCenterContext)

  useEffect(() => {
    messageCenter.setIgnoreWarnings(true)
  }, [])

  return (
    <LiveMintingProvider>
      <LiveMintingGuard>
        <LiveMintingWalletGuard>{children}</LiveMintingWalletGuard>
      </LiveMintingGuard>
    </LiveMintingProvider>
  )
}
