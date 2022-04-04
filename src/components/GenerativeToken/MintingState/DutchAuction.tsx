import style from "./MintingState.module.scss"
import daStyle from "./DutchAuction.module.scss"
import cs from "classnames"
import { IDutchAuctionState, IMintingState } from "../../../hooks/useMintingState"
import { Countdown } from "../../Utils/Countdown"
import { MintingStateTimer } from "./MintingStateTimer"
import { DisplayTezos } from "../../Display/DisplayTezos"
import { Spacing } from "../../Layout/Spacing"
import { DutchAuctionLevels } from "../Pricing/DutchAuctionLevels"
import { useMemo } from "react"
import { formatDuration, intervalToDuration } from "date-fns"

interface Props {
  state: IMintingState
  verbose: boolean
}
export function DutchAuctionState({
  state,
  verbose,
}: Props) {
  const daState = state.dutchAuctionState!

  // is the auction going to start in ...
  const willStart = !daState.active && !daState.ended

  // the interval string of cange duration
  const changeDurationString = useMemo(() => {
    return formatDuration(
      intervalToDuration({
        start: 0,
        end: state.token.pricingDutchAuction!.decrementDuration*1000
      })
    )
  }, [])

  return willStart ? (
    <div>
      <MintingStateTimer
        until={daState.opensAt}
      >
        Auction starts in
      </MintingStateTimer>
      {verbose && (
        <div className={cs(daStyle.details)}>
          <div className={cs(daStyle.pricing)}>
            <span>Price: </span>
            <DutchAuctionLevels
              levels={state.token.pricingDutchAuction!.levels}
            />
          </div>
          <span>
            changes every {changeDurationString}
          </span>
        </div>
      )}
    </div>
  ):daState.active ? (
    <div className={cs(style.multilines)}>
      <div className={cs(style.active)}>
        <i className="fa-solid fa-circle-small" aria-hidden/>{" "}
        Auction is active
      </div>
      {verbose && (
        <div className={cs(daStyle.details)}>
          <div className={cs(daStyle.pricing)}>
            <span>Price: </span>
            <DutchAuctionLevels
              levels={state.token.pricingDutchAuction!.levels}
              activeLevel={state.price}
            />
          </div>
          <span>
            changes in <Countdown until={daState.nextStepAt!}/>
          </span>
        </div>
      )}
    </div>
  ):null
}