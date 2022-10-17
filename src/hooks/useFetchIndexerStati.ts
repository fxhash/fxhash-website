import { useState } from "react"
import { useQuery } from "@apollo/client"
import { IndexerStatus, NetworkStatus } from "../types/IndexerStatus"
import { getTezosNetworkIndexerStatus } from "../services/IndexerStatus"
import { useClientEffect } from "../utils/hookts"
import { Qu_indexerStatus } from "../queries/indexer-status"

export function useFetchIndexerStati(): [
  IndexerStatus | null,
  NetworkStatus | null
] {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null)

  useClientEffect(() => {
    async function fetchNetworkStatus() {
      try {
        const status = await getTezosNetworkIndexerStatus()
        setNetworkStatus(status)
      } catch (e) {
        console.error(e)
      }
    }
    fetchNetworkStatus()
  }, [])

  const { data } = useQuery<{ statusIndexing: IndexerStatus }>(
    Qu_indexerStatus,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-and-network",
    }
  )

  return [data?.statusIndexing || null, networkStatus]
}
