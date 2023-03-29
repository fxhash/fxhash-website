import { TInputPricingDutchAuction } from "../pricing-dutch-auction/input"
import { TInputPricingFixed } from "../pricing-fixed/input"

export type TInputPricingDetails<N = number> = TInputPricingFixed<N>

export type TInputPricing<N = number, Details = string> = {
  pricing_id: N
  details: Details
  lock_for_reserves: boolean
}
