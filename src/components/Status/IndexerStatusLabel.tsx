import style from "./IndexerStatusLabel.module.scss"
import { IndexerStatus, NetworkStatus } from "../../types/IndexerStatus"
import { Loader } from "../Utils/Loader"
import { useIndexerStatusSeverity } from "../../hooks/useIndexerStatusSeverity"
import { IndexerStatusIcon } from "./IndexerStatusIcon"

interface Props {
  status?: IndexerStatus | null
  networkStatus?: NetworkStatus | null
  label?: string
}

export function IndexerStatusLabel({
  status,
  networkStatus,
  label = "Indexer status",
}: Props) {
  const severity = useIndexerStatusSeverity(status, networkStatus)
  return (
    <span className={style.root}>
      {!severity ? (
        <Loader size="tiny" color="currentColor" className={style.loader} />
      ) : (
        <IndexerStatusIcon severity={severity} />
      )}
      <span>{label}</span>
    </span>
  )
}
