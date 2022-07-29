import style from "./MintingState.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { EMintingState, IMintingState, useMintingState } from "../../../hooks/useMintingState"
import { DutchAuctionState } from "./DutchAuction"
import { Spacing } from "../../Layout/Spacing"
import { FixedPricingState } from "./FixedPricing"
import { ModLockState } from "./ModLock"


interface Props {
  token: GenerativeToken
  // can be used to display any extra information
  verbose?: boolean
  // an existing state can be passed down to prevent this component
  // from creating a minting state
  existingState?: IMintingState
}

/**
 * A generic component to display the minting state of a token:
 * When it unlocks (mod, opens at), auction state (active, next price)
 */
export function MintingState({
  token,
  verbose = false,
  existingState,
}: Props) {
  const mintingState = useMintingState(token);
  const state = existingState || mintingState

  return (
    <>
      {state.activeState === EMintingState.DUTCH_AUCTION ? (
        <DutchAuctionState
          state={state}
          verbose={verbose}
        />
      ):state.activeState === EMintingState.FIXED_PRICING ? (
        <FixedPricingState
          state={state.fixedPricingState!}
          verbose={verbose}
        />
      ):state.activeState === EMintingState.MOD_LOCK ? (
        <ModLockState
          state={state.modLockState}
          verbose={verbose}
        />
      ):null}

      {state.activeState !== null && (
        <Spacing size="x-small"/>
      )}
    </>
  )
}
