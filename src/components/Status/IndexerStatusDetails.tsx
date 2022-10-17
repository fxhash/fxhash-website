import style from "./IndexerStatusDetails.module.scss"
import { IndexerStatus, NetworkStatus } from "../../types/IndexerStatus"
import { formatDistanceToNow, formatDistanceStrict } from "date-fns"
import { IndexerStatusSmall } from "./IndexerStatusSmall"

interface Props {
  status: IndexerStatus
  networkStatus: NetworkStatus
}

export function IndexerStatusDetails({ status, networkStatus }: Props) {
  return (
    <div className={style.root}>
      <div>
        <div>Indexer Status</div>
        <div>
          {Number((status.level / networkStatus.level) * 100).toFixed(3)}%
        </div>
      </div>
      <div>
        <div>Indexer is behind the blockhain by</div>
        <div>
          {formatDistanceStrict(
            new Date(status.lastIndexedAt),
            new Date(networkStatus.lastSyncedAt)
          )}{" "}
          / {networkStatus.level - status.level} blocks
        </div>
      </div>
      <div>
        <div>Time of last indexer block processed</div>
        <div>
          {formatDistanceToNow(new Date(status.lastIndexedAt), {
            addSuffix: true,
          })}
        </div>
      </div>
      <div>
        <div>Index of last block processed</div>
        <div>#{status.level}</div>
      </div>
    </div>
  )
}
