import classes from "./IndexerStatusDetails.module.scss"
import { IndexerStatus, NetworkStatus } from "../../types/IndexerStatus"
import { formatDistanceToNow } from "date-fns"
import { IndexerStatusLabel } from "./IndexerStatusLabel"
import {
  NUM_BLOCKS_MEDIUM_SEVERITY,
  useIndexerStatusSeverity,
} from "../../hooks/useIndexerStatusSeverity"
import { BlockchainProgress } from "./BlockchainProgress"

interface Props {
  status: IndexerStatus
  networkStatus: NetworkStatus
}

export function IndexerStatusDetails({ status, networkStatus }: Props) {
  const numBlocksBehind = networkStatus.level - status.level
  const severity = useIndexerStatusSeverity(status, networkStatus)
  return (
    <div className={classes.root}>
      <section>
        <h3>Indexer</h3>
        <div style={{ alignSelf: "center" }}>
          <IndexerStatusLabel status={status} networkStatus={networkStatus} />
        </div>
      </section>
      <BlockchainProgress
        numBlocksBehind={numBlocksBehind}
        severity={severity}
      />
      <p>
        <span>
          Indexer is behind the blockchain by <b>{numBlocksBehind}</b> blocks.
        </span>
        {numBlocksBehind >= NUM_BLOCKS_MEDIUM_SEVERITY ? (
          <span>
            We should be behind at most 4 blocks, our services may have an
            issue. It is expected to be behind 2 and 4 blocks with our indexing
            strategy.
          </span>
        ) : (
          <span>
            It is expected to be behind 2 and 4 blocks with our indexing
            strategy.
          </span>
        )}
      </p>
      <section>
        <div className={classes.indexerStatus}>
          <h5>Last block indexed</h5>
          <div>#{status.level}</div>
          <div>
            {formatDistanceToNow(new Date(status.lastIndexedAt), {
              addSuffix: true,
            })}
          </div>
        </div>
        <div className={classes.networkStatus}>
          <h5>Blockchain Head</h5>
          <div>#{networkStatus.level}</div>
          <div>
            {formatDistanceToNow(new Date(networkStatus.lastSyncedAt), {
              addSuffix: true,
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
