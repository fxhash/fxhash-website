import style from "./Activity.module.scss"
import cs from "classnames"
import {
  Action as ActionType,
  TokenActionType,
} from "../../types/entities/Action"
import { Action } from "./Action"
import { useMemo } from "react"
import Skeleton from "../Skeleton"

const ActionsPredecescence: Record<TokenActionType, number> = {
  NONE: 0,
  UPDATE_STATE: 0,
  UPDATE_PRICING: 0,
  BURN_SUPPLY: 0,
  MINTED: 0,
  CODEX_UPDATED: 0,
  MINTED_FROM: 1,
  TICKET_MINTED: 1,
  GENTK_SIGNED: 1,
  COMPLETED: 20,
  TRANSFERED: 1,
  LISTING_V1: 4,
  LISTING_V1_CANCELLED: 3,
  LISTING_V1_ACCEPTED: 5,
  LISTING_V2: 4,
  LISTING_V2_CANCELLED: 3,
  LISTING_V2_ACCEPTED: 5,
  LISTING_V3: 4,
  LISTING_V3_CANCELLED: 3,
  LISTING_V3_ACCEPTED: 5,
  OFFER: 4,
  OFFER_CANCELLED: 3,
  OFFER_ACCEPTED: 5,
  COLLECTION_OFFER: 4,
  COLLECTION_OFFER_CANCELLED: 3,
  COLLECTION_OFFER_ACCEPTED: 5,
  AUCTION: 4,
  AUCTION_BID: 4,
  AUCTION_CANCELLED: 3,
  AUCTION_FULFILLED: 5,
  ARTICLE_MINTED: 0,
  ARTICLE_EDITIONS_TRANSFERED: 1,
  ARTICLE_METADATA_UPDATED: 1,
  ARTICLE_METADATA_LOCKED: 20,
}

// group actions by timestamp, sort by type within group, then rebuild array
function sortActions(actions: ActionType[]): ActionType[] {
  // batch actions by timestamp
  const batches: Record<string, ActionType[]> = {}
  for (const action of actions) {
    if (!batches[action.createdAt]) batches[action.createdAt] = []
    batches[action.createdAt].push(action)
  }
  // sort each batch, and rebuild the output array at the same time
  let ret: ActionType[] = []
  for (const k in batches) {
    batches[k] = batches[k].sort(
      (a, b) => ActionsPredecescence[b.type] - ActionsPredecescence[a.type]
    )
    ret = [...ret, ...batches[k]]
  }
  return ret
}

interface Props {
  actions: ActionType[]
  className?: string
  verbose?: boolean
  loading?: boolean
}

export function Activity({
  actions,
  className,
  verbose = false,
  loading = false,
}: Props) {
  const sortedActions = useMemo(() => sortActions(actions), [actions])
  return (
    <section className={cs(style.container, className)}>
      {sortedActions?.length > 0 || loading ? (
        <>
          {sortedActions?.length > 0 &&
            sortedActions.map((action) => (
              <Action key={action.id} action={action} verbose={verbose} />
            ))}
          {loading &&
            [...Array(20)].map((_, idx) => (
              <Skeleton key={idx} height="42px" />
            ))}
        </>
      ) : (
        <em>No activity yet</em>
      )}
    </section>
  )
}
