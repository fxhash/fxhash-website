import { TInputPricingFixed } from "../pricing-fixed/input"

export type TInputPricingDetails<N = number> = 
  TInputPricingFixed<N>

export type TInputPricing<N = number, Details = string> = {
  pricing_id: N
  details: Details
}