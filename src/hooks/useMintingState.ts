import { addSeconds, differenceInSeconds, isAfter } from "date-fns"
import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../containers/UserProvider"
import { GenerativeToken, GenTokFlag } from "../types/entities/GenerativeToken"
import { ConnectedUser } from "../types/entities/User"
import { clamp } from "../utils/math"


// an object which describes the state for Dutch Auction tokens
export interface IDutchAuctionState {
  // after opens_at and before resting price is met
  active: boolean
  // after resting price is met
  ended: boolean
  // the next price step
  nextPrice?: number
  // the time when next price step will start
  nextStepAt?: Date
  // when the dutch auction starts
  opensAt: Date
}

// an object which describes the state of fixed pricing
export interface IFixedPricingState {
  // if opens_at, true only after opens_at. otherwise true
  active: boolean
  // when will it open, if any
  opensAt?: Date
}

// an object which describes the state of a moderation lock
export interface IModLockState {
  // if it's locked
  locked: boolean
  // when it's supposed to open
  unlocksAt?: Date
}

// the different possible active states
export enum EMintingState {
  MOD_LOCK = "MOD_LOCK",
  DUTCH_AUCTION = "DUTCH_AUCTION",
  FIXED_PRICING = "FIXED_PRICING", 
}

export interface IMintingState {
  token: GenerativeToken
  // the active price, should be used to populate the button and mint call
  price: number
  // should the minting button be locked
  locked: boolean
  // should the minting button be hidden ?
  hidden: boolean
  // is the token enabled for the current user ?
  enabled: boolean
  // the state of the dutch auction, if null it's not a dutch auction
  dutchAuctionState: IDutchAuctionState|null
  // the state of a fixed pricing; if null, it's not a fixed pricing
  fixedPricingState: IFixedPricingState|null
  // the state of the moderation lock
  modLockState: IModLockState
  // the active state - the one which makes sense to represent on the UI
  activeState: EMintingState|null
  // when the state will require a new computation; basically it also stores
  // the furthest locking/updating timer - if null we will never need to refresh
  nextRefreshTimer: Date|null
}

/**
 * A generic purpose function which can be called to compute a minting context
 * state based on a Generative Token.
 */
function deriveMintingStateFromToken(
  token: Readonly<GenerativeToken>,
  user: Readonly<ConnectedUser>|null,
  forceDisabled: boolean
): IMintingState {
  // should the minting button be hidden ?
  const hidden = [GenTokFlag.MALICIOUS, GenTokFlag.HIDDEN].includes(token.flag) 
    || token.balance === 0

  // is the token enabled for the current user
  const enabled = !forceDisabled
    && (token.enabled || token.author.id === user?.id)

  // initialize the price - it will be set afterwards
  let price = 0
  // initialize the refresh timer (null = no need to refresh)
  let refreshTimer: Date|null = null
  // initialize the locking state
  let locked = false

  // we instanciate "now" once
  const now = new Date()

  // the moderation lock state
  const modLockState: IModLockState = {
    locked: false,
  }
  // the state of the dutch auction
  let daState: IDutchAuctionState|null = null
  // the state of a fixed pricing
  let fixedState: IFixedPricingState|null = null
  // the minting state of interest
  let activeMintingState: EMintingState|null = null

  // check if moderation lock is active
  const unlocksAt = new Date(token.lockEnd)
  if (isAfter(unlocksAt, now)) {
    modLockState.locked = true
    modLockState.unlocksAt = unlocksAt
    // globally locked
    locked = true
    // set the mod lock as active state
    activeMintingState = EMintingState.MOD_LOCK
    refreshTimer = unlocksAt
  }

  if (!!token.pricingDutchAuction) {
    const da = token.pricingDutchAuction!
    // when it opens
    const opensAt = new Date(da.opensAt!)
    let activeTimer = opensAt
    // when will the resting price be met ?
    const endsAt = addSeconds(
      opensAt,
      (da.levels.length-1) * da.decrementDuration,
    )
    // is the auction started/ended ?
    const started = isAfter(now, opensAt)
    const ended = isAfter(now, endsAt)
    // is the auction active ? now € [start, ends]
    const active = started && !ended
    
    // set a basic state with required values
    daState = {
      active,
      ended,
      opensAt,
    }

    // get the difference in seconds between now and the start of auction
    const diffSec = differenceInSeconds(now, opensAt)
    // get the level for the current time
    const levelIdx = clamp(
      Math.floor(diffSec/da.decrementDuration),
      0,
      da.levels.length-1
    )

    // if auction is active, then we need to populate the rest
    if (active) {
      const nextLevelIdx = levelIdx+1
      daState.nextPrice = da.levels[nextLevelIdx]
      daState.nextStepAt = addSeconds(
        opensAt,
        nextLevelIdx * da.decrementDuration
      )
      activeTimer = daState.nextStepAt
    }

    // we also set the price of the button
    price = da.levels[levelIdx]

    // check if the dutch auction state needs to prevail
    if (!refreshTimer || isAfter(activeTimer, refreshTimer)) {
      activeMintingState = EMintingState.DUTCH_AUCTION
      refreshTimer = activeTimer
      // globally locked if not started
      locked = !started
    }
  }
  // if it's a fixed pricing
  else if (!!token.pricingFixed) {
    // set a basic state with required values
    fixedState = {
      active: true,
    }
    // if there's an opening, check for it
    if (token.pricingFixed.opensAt) {
      const opensAt = new Date(token.pricingFixed.opensAt)
      fixedState.opensAt = opensAt
      // it's only activeif now > opensAt
      fixedState.active = isAfter(now, opensAt)

      // check if the pricing fixed state needs to prevail
      if (!refreshTimer || isAfter(opensAt, refreshTimer)) {
        activeMintingState = EMintingState.FIXED_PRICING
        refreshTimer = opensAt
        // globally locked if not active
        locked = !fixedState.active
      }
    }

    // we also set the price
    price = token.pricingFixed.price
  }

  return {
    token: token,
    price: price,
    locked: locked,
    hidden: hidden,
    enabled: enabled,
    dutchAuctionState: daState,
    fixedPricingState: fixedState,
    modLockState: modLockState,
    activeState: activeMintingState,
    nextRefreshTimer: refreshTimer,
  }
}

/**
 * The Minting State Hook provides utilities to have a managed local state
 * to both control the UI related to the minting state of a token as well as 
 * some values required for contract calls (such as the current price).
 * 
 * It re-renders the component when the UI needs to be updated.
 * 
 * When a Minting State is instaciated in the tree, it will spawn up the
 * eventual timeouts related to updates based on timings, which in turn will
 * update the state.
 * This way, all the UI can be derived from this source of truth logic.
 */
export function useMintingState(
  token: GenerativeToken,
  forceDisabled: boolean = false,
) {
  // we need the user to derive certain states
  const userContext = useContext(UserContext)
  // initialize the state
  const [state, setState] = useState<IMintingState>(
    deriveMintingStateFromToken(
      token,
      userContext.user,
      forceDisabled,
    )
  )
  // keep a reference to the active timer in timeouts
  const activeTimer = useRef<number>()

  // when the component is instanciated or when the state is updated, we may
  // need to trigger some timeouts well crafted which should update the
  // state based on token informations
  //! those timeouts must be cleared properly to avoid render loops
  useEffect(() => {
    if (state.nextRefreshTimer) {
      // only apply the timeout to refresh the state if same timer doesn't
      // already exists
      const T = state.nextRefreshTimer.getTime()
      if (!activeTimer.current || activeTimer.current !== T) {
        activeTimer.current = T
        // we compute when we need to trigger the timer
        const triggerIn = T - Date.now()
        // only trigger anything if it's in the future
        if (triggerIn >= 0) {
          // request a state update when timer will trigger
          const timeoutID = setTimeout(() => {
            setState(
              deriveMintingStateFromToken(
                token,
                userContext.user,
                forceDisabled,
              )
            )
          }, triggerIn + 10)
          // return the timer clear
          return () => {
            activeTimer.current = undefined
            clearTimeout(timeoutID)
          }
        }
      }
    }
  }, [state])

  // when the user in the state changes, we need to refresh the state
  useEffect(() => {
    setState(
      deriveMintingStateFromToken(
        token,
        userContext.user,
        forceDisabled,
      )
    )
  }, [userContext.user])

  return state
}
