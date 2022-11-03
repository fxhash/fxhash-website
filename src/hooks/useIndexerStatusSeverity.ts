import { useContext, useMemo } from "react"
import { IndexerStatusSeverity } from "../types/IndexerStatus"
import { IndexerStatusContext } from "../context/IndexerStatus"

export const NUM_BLOCKS_MEDIUM_SEVERITY = 4
export const NUM_BLOCKS_HIGH_SEVERITY = 15

export function useIndexerStatusSeverity(): IndexerStatusSeverity | null {
  const { indexerStatus, networkStatus } = useContext(IndexerStatusContext)
  const severity = useMemo(() => {
    if (!indexerStatus || !networkStatus) return null
    const blocksBehind = networkStatus.level - indexerStatus.level
    if (blocksBehind <= NUM_BLOCKS_MEDIUM_SEVERITY)
      return "low"
    if (blocksBehind <= NUM_BLOCKS_HIGH_SEVERITY) return "medium"
    return "high"
  }, [indexerStatus, networkStatus])

  return severity
}
