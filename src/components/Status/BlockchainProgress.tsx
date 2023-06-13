import classes from "./BlockchainProgress.module.scss"
import {
  NUM_BLOCKS_MEDIUM_SEVERITY,
  NUM_BLOCKS_HIGH_SEVERITY,
} from "../../hooks/useIndexerStatusSeverity"
import cx from "classnames"
import { IndexerStatusSeverity } from "../../types/IndexerStatus"

const DEFAULT_BLOCK_WIDTH = 5
const DEFAULT_BLOCK_GAP = 4

interface BlockchainProgressBarProps {
  blockWidth?: number
  blockGap?: number
  className?: string
  style?: Object
}

function BlockchainProgressBar({
  blockWidth = DEFAULT_BLOCK_WIDTH,
  blockGap = DEFAULT_BLOCK_GAP,
  className,
  style = {},
}: BlockchainProgressBarProps) {
  return (
    <div
      className={cx(classes.blockchain, className)}
      style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent ${blockGap}px, currentColor ${blockGap}px, currentColor)`,
        backgroundSize: `${blockWidth + blockGap}px 100%`,
        ...style,
      }}
    />
  )
}

interface BlockchainProgressProps {
  severity?: IndexerStatusSeverity | null
  numBlocksBehind?: number
  blockWidth?: number
  blockGap?: number
}

export function BlockchainProgress({
  severity,
  numBlocksBehind,
  blockWidth = DEFAULT_BLOCK_WIDTH,
  blockGap = DEFAULT_BLOCK_GAP,
}: BlockchainProgressProps) {
  return (
    <div className={classes.statusWrapper}>
      <BlockchainProgressBar />
      {numBlocksBehind && (
        <>
          <BlockchainProgressBar
            className={classes.statusDone}
            style={{
              width: `calc( 100% - ${
                numBlocksBehind * (blockWidth + blockGap)
              }px)`,
            }}
          />
          {severity && (
            <BlockchainProgressBar
              className={classes[severity]}
              style={{
                right: `calc(${
                  NUM_BLOCKS_MEDIUM_SEVERITY * (blockWidth + blockGap)
                }px)`,
                width: `calc(${
                  (numBlocksBehind - NUM_BLOCKS_MEDIUM_SEVERITY) *
                  (blockWidth + blockGap)
                }px)`,
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
