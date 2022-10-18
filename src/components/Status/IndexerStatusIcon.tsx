import style from "./IndexerStatusIcon.module.scss"
import cx from "classnames"
import { IndexerStatusSeverity } from "../../types/IndexerStatus"

const iconSeverityMap = {
  low: "circle-check",
  medium: "circle-exclamation",
  high: "circle-xmark",
}

interface Props {
  severity: IndexerStatusSeverity
}

export function IndexerStatusIcon({ severity }: Props) {
  return (
    <span
      className={cx(
        "fa-solid",
        `fa-${iconSeverityMap[severity]}`,
        style[severity]
      )}
    />
  )
}
