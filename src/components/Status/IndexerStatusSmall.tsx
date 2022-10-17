import style from "./IndexerStatusSmall.module.scss"
import { IndexerStatus, NetworkStatus } from "../../types/IndexerStatus"
import { formatDistanceStrict } from "date-fns"
import cx from "classnames"
import { Loader } from "../Utils/Loader"
type IndexerStatusSeverity = "low" | "medium" | "high"

const IconSeverityMap = {
  low: "circle-check",
  medium: "circle-exclamation",
  high: "circle-xmark",
}

function getIndexerStatusSeverity(
  indexerStatus?: IndexerStatus | null,
  networkStatus?: NetworkStatus | null
): IndexerStatusSeverity | null {
  if (!indexerStatus || !networkStatus) return null
  const blocksBehind = networkStatus.level - indexerStatus.level
  const minutesBehind = +formatDistanceStrict(
    new Date(indexerStatus.lastIndexedAt),
    new Date(networkStatus.lastSyncedAt),
    { unit: "minute" }
  ).replace(" minutes", "")
  if (blocksBehind <= 4 && minutesBehind <= 2) return "low"
  if (blocksBehind <= 15) return "medium"
  return "high"
}

interface Props {
  status?: IndexerStatus | null
  networkStatus?: NetworkStatus | null
  label?: string
}

export function IndexerStatusSmall({
  status,
  networkStatus,
  label = "Indexer status",
}: Props) {
  const severity = getIndexerStatusSeverity(status, networkStatus)
  return (
    <span className={style.root}>
      {!severity ? (
        <Loader size="tiny" color="currentColor" className={style.loader} />
      ) : (
        <span
          className={cx(
            "fa-solid",
            `fa-${IconSeverityMap[severity]}`,
            style.icon,
            style[severity]
          )}
        />
      )}
      <span>{label}</span>
    </span>
  )
}
