import { useState } from "react"
import { useLazyQuery } from "@apollo/client"
import { IndexerStatus, NetworkStatus } from "../types/IndexerStatus"
import { getTezosNetworkIndexerStatus } from "../services/IndexerStatus"
import { useClientEffect } from "../utils/hookts"
import { Qu_indexerStatus } from "../queries/indexer-status"

export function useFetchIndexerAndNetworkStatus(): [
  IndexerStatus | null,
  NetworkStatus | null,
  () => void
] {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null)

  async function fetchNetworkStatus() {
    try {
      const status = await getTezosNetworkIndexerStatus()
      setNetworkStatus(status)
    } catch (e) {
      console.error(e)
    }
  }

  const [fetchIndexerStatus, { data }] = useLazyQuery<{
    statusIndexing: IndexerStatus
  }>(Qu_indexerStatus, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
  })

  function loadAll() {
    fetchNetworkStatus()
    fetchIndexerStatus()
  }

  useClientEffect(() => {
    loadAll()
  }, [])

  return [data?.statusIndexing || null, networkStatus, loadAll]
}
