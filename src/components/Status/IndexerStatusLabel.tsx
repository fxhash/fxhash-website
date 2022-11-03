import style from "./IndexerStatusLabel.module.scss"
import cs from "classnames"
import { Loader } from "../Utils/Loader"
import { IndexerStatusIcon } from "./IndexerStatusIcon"
import { IndexerStatusSeverity } from "../../types/IndexerStatus"

interface Props {
  label?: string
  severity: IndexerStatusSeverity | null
  iconSide?: "left"|"right"
  iconSize?: "small"|"big"
}

const indexerStatusLabelSeverityMap = {
  low: "synced",
  medium: "slight delay",
  high: "too much behind",
}

export function IndexerStatusLabel({ 
  label, 
  severity,
  iconSide = "left",
  iconSize = "small",
}: Props) {
  return (
    <span className={cs(style.root, style[`severity_${severity}`], style[`icon_${iconSide}`])}>
      {!severity ? (
        <Loader size="tiny" color="currentColor" className={style.loader} />
      ) : (
        <IndexerStatusIcon severity={severity} size={iconSize} />
      )}
      <span>
        {label || (severity && indexerStatusLabelSeverityMap[severity])}
      </span>
    </span>
  )
}
