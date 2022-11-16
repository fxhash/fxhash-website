import { NetworkStatus } from "../types/IndexerStatus"

export async function getTezosNetworkIndexerStatus(): Promise<NetworkStatus> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_TZKT_API!}head`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (response.status === 200) {
    return await response.json().then((json) => ({
      level: json.level,
      lastSyncedAt: json.lastSync,
    }))
  }
  throw new Error("Error retreiving indexer status")
}
