import { useMemo } from "react"
import {
  IndexerStatus,
  NetworkStatus,
  IndexerStatusSeverity,
} from "../types/IndexerStatus"
import formatDistanceStrict from "date-fns/formatDistanceStrict"

export const NUM_BLOCKS_MEDIUM_SEVERITY = 4
export const NUM_BLOCKS_HIGH_SEVERITY = 15

export function useIndexerStatusSeverity(
  indexerStatus?: IndexerStatus | null,
  networkStatus?: NetworkStatus | null
): IndexerStatusSeverity | null {
  const severity = useMemo(() => {
    if (!indexerStatus || !networkStatus) return null
    const blocksBehind = networkStatus.level - indexerStatus.level
    const minutesBehind = +formatDistanceStrict(
      new Date(indexerStatus.lastIndexedAt),
      new Date(networkStatus.lastSyncedAt),
      { unit: "minute" }
    ).replace(" minutes", "")
    if (blocksBehind <= NUM_BLOCKS_MEDIUM_SEVERITY && minutesBehind <= 2)
      return "low"
    if (blocksBehind <= NUM_BLOCKS_HIGH_SEVERITY) return "medium"
    return "high"
  }, [indexerStatus, networkStatus])

  return severity
}
