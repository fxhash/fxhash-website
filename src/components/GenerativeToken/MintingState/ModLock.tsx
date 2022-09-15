import style from "./MintingState.module.scss"
import cs from "classnames"
import {
  IDutchAuctionState,
  IModLockState,
} from "../../../hooks/useMintingState"
import { Countdown } from "../../Utils/Countdown"
import { MintingStateTimer } from "./MintingStateTimer"
import { DisplayTezos } from "../../Display/DisplayTezos"
import { Spacing } from "../../Layout/Spacing"
import { useMemo } from "react"
import { differenceInSeconds } from "date-fns"

interface Props {
  state: IModLockState
  verbose: boolean
}
export function ModLockState({ state, verbose }: Props) {
  // if it opened in the last 15 minutes
  const recentlyOpened = useMemo(() => {
    if (state.unlocksAt && !state.locked) {
      const dist = differenceInSeconds(new Date(), state.unlocksAt)
      if (dist < 15 * 60) return true
    }
    return false
  }, [state])

  return recentlyOpened ? (
    <div className={cs(style.active)}>
      <i className="fa-solid fa-circle-small" aria-hidden /> Recently opened
    </div>
  ) : (
    <MintingStateTimer icon="fa-solid fa-lock" until={state.unlocksAt!}>
      Unlocks in
    </MintingStateTimer>
  )
}
