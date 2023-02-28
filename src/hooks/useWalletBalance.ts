import { useState } from "react"
import { UserContextType } from "../containers/UserProvider"
import { useClientAsyncEffect } from "../utils/hookts"
import { useAsyncInterval } from "./useAsyncInterval"

/**
 * Periodically checks for the balance of a wallet if the user is connected
 * and their wallet is accessible
 */
export function useWalletBalance(ctx: UserContextType) {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useAsyncInterval(
    async () => {
      setLoading(true)
      try {
        if (ctx.walletManager && ctx.user) {
          const walletBalance =
            await ctx.walletManager?.tezosToolkit.tz.getBalance(ctx.user?.id)

          // is called if component is mounted
          return () => {
            setBalance(walletBalance.toNumber())
            setLoading(false)
          }
        }
        throw null
      } catch {
        return () => {
          setLoading(false)
        }
      }
    },
    30000,
    [ctx]
  )

  return {
    balance,
    loading,
  }
}
