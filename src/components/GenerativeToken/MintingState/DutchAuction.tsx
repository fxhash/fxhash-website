import style from "./MintingState.module.scss"
import cs from "classnames"
import { IDutchAuctionState } from "../../../hooks/useMintingState"
import { Countdown } from "../../Utils/Countdown"
import { MintingStateTimer } from "./MintingStateTimer"
import { DisplayTezos } from "../../Display/DisplayTezos"
import { Spacing } from "../../Layout/Spacing"

interface Props {
  state: IDutchAuctionState
  verbose: boolean
}
export function DutchAuctionState({
  state,
  verbose,
}: Props) {
  // is the auction going to start in ...
  const willStart = !state.active && !state.ended

  return willStart ? (
    <div>
      <MintingStateTimer
        until={state.opensAt}
      >
        Auction starts in
      </MintingStateTimer>
    </div>
  ):state.active ? (
    <div className={cs(style.multilines)}>
      <div className={cs(style.active)}>
        <i className="fa-solid fa-circle-small" aria-hidden/>{" "}
        Auction is active
      </div>
      {verbose && (
        <MintingStateTimer
          icon="fa-solid fa-arrow-down-right"
          until={state.nextStepAt!}
        >
          Next step at{" "}
          <strong>
            <DisplayTezos
              mutez={state.nextPrice!}
              tezosSize="regular"
              formatBig={false}
            />
          </strong>{" "}
          in
        </MintingStateTimer>
      )}
    </div>
  ):null
}