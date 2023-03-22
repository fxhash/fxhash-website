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
    if (messageCenter.ready) {
      messageCenter.setIgnoreWarnings(true)
    }
  }, [messageCenter.ready])

  return (
    <LiveMintingProvider>
      <LiveMintingGuard>
        <LiveMintingWalletGuard>{children}</LiveMintingWalletGuard>
      </LiveMintingGuard>
    </LiveMintingProvider>
  )
}
