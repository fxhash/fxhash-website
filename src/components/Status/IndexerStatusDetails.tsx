import style from "./IndexerStatusDetails.module.scss"
import { IndexerStatus, NetworkStatus } from "../../types/IndexerStatus"
import { formatDistanceStrict, format } from "date-fns"

interface Props {
  status: IndexerStatus
  networkStatus: NetworkStatus
}

export function IndexerStatusDetails({ status, networkStatus }: Props) {
  return (
    <div className={style.root}>
      <div>
        <b>Last block indexed</b>
        <div>
          {format(new Date(status.lastIndexedAt), "dd.MM.yyyy - HH:mm")}
          &nbsp;/&nbsp;#{status.level}
        </div>
      </div>
      <div>
        <b>Distance with Blockchain</b>
        <div>
          {formatDistanceStrict(
            new Date(status.lastIndexedAt),
            new Date(networkStatus.lastSyncedAt)
          )}{" "}
          / {networkStatus.level - status.level} blocks
        </div>
      </div>
    </div>
  )
}
