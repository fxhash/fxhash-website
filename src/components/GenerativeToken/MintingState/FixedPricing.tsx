import style from "./MintingState.module.scss"
import cs from "classnames"
import { IDutchAuctionState, IFixedPricingState } from "../../../hooks/useMintingState"
import { Countdown } from "../../Utils/Countdown"
import { MintingStateTimer } from "./MintingStateTimer"
import { DisplayTezos } from "../../Display/DisplayTezos"
import { Spacing } from "../../Layout/Spacing"
import { useMemo } from "react"
import { differenceInSeconds } from "date-fns"

interface Props {
  state: IFixedPricingState
  verbose: boolean
}
export function FixedPricingState({
  state,
  verbose,
}: Props) {
  // if it opened in the last 15 minutes
  const recentlyOpened = useMemo(() => {
    if (state.opensAt && state.active) {
      const dist = differenceInSeconds(new Date(), state.opensAt)
      if (dist < 15*60) return true
    }
    return false
  }, [state])

  return state.opensAt ? (
    state.active ? (
      recentlyOpened ? (
        <div className={cs(style.active)}>
          <i className="fa-solid fa-circle-small" aria-hidden/>{" "}
          Recently opened
        </div>
      ):null
    ):(
      <MintingStateTimer
        until={state.opensAt}
      >
        Mint opens in
      </MintingStateTimer>
    )
  ):null
}