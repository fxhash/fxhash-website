import React, { PropsWithChildren, useMemo, useState } from "react"
import { useFetchIndexerAndNetworkStatus } from "../hooks/useFetchIndexerAndNetworkStatus"
import { IndexerStatus, NetworkStatus } from "../types/IndexerStatus"
import { useClientEffect } from "../utils/hookts"

export interface IndexerStatusContext {
  indexerStatus: IndexerStatus | null
  networkStatus: NetworkStatus | null
}

const defaultCtx: IndexerStatusContext = {
  indexerStatus: null,
  networkStatus: null,
}

export const IndexerStatusContext = React.createContext(defaultCtx)

type Props = PropsWithChildren<{
  indexerStatus?: IndexerStatus | null
  networkStatus?: NetworkStatus | null
}>

export function IndexerStatusProvider({
  children,
  indexerStatus = null,
  networkStatus = null,
}: Props) {
  const [latestIndexerStatus, latestNetworkStatus, reloadStatus] =
    useFetchIndexerAndNetworkStatus()

  const context = useMemo(
    () => ({
      indexerStatus: latestIndexerStatus || indexerStatus,
      networkStatus: latestNetworkStatus || networkStatus,
    }),
    [indexerStatus, networkStatus, latestIndexerStatus, latestNetworkStatus]
  )

  useClientEffect(() => {
    const reloadInterval = setInterval(() => {
      reloadStatus()
    }, 30000)
    return () => clearInterval(reloadInterval)
  })

  return (
    <IndexerStatusContext.Provider value={context}>
      {children}
    </IndexerStatusContext.Provider>
  )
}
