import style from "./IndexerStatusLabel.module.scss"
import { Loader } from "../Utils/Loader"
import { IndexerStatusIcon } from "./IndexerStatusIcon"
import { IndexerStatusSeverity } from "../../types/IndexerStatus"

interface Props {
  label?: string
  severity: IndexerStatusSeverity | null
}

const indexerStatusLabelSeverityMap = {
  low: "synced",
  medium: "slight delay",
  high: "too much behind",
}

export function IndexerStatusLabel({ label, severity }: Props) {
  return (
    <span className={style.root}>
      {!severity ? (
        <Loader size="tiny" color="currentColor" className={style.loader} />
      ) : (
        <IndexerStatusIcon severity={severity} />
      )}
      <span>
        {label || (severity && indexerStatusLabelSeverityMap[severity])}
      </span>
    </span>
  )
}
