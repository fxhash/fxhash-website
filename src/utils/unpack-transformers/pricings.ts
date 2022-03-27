import type { BigNumber } from "bignumber.js"
import { TInputPricingFixed } from "../../services/parameters-builder/pricing-fixed/input"
import { TInputPricing, TInputPricingDetails } from "../../services/parameters-builder/pricing/input"

export function transformPricingFixedBigNumbers(
  bnInput: TInputPricingFixed<BigNumber>
): TInputPricingFixed<number> {
  return {
    price: bnInput.price.toNumber(),
    opens_at: bnInput.opens_at,
  }
}

export function transformPricingBigNumber(
  bnInput: TInputPricing<BigNumber, TInputPricingDetails<BigNumber>>
): TInputPricing<number, TInputPricingDetails<number>> {
  const id = bnInput.pricing_id.toNumber()
  if (id === 0) {
    return {
      pricing_id: id,
      details: transformPricingFixedBigNumbers(bnInput.details),
    }
  }
  throw new Error(`Must implement transform pricing BigNumber -> number for prcing method ${id}`)
}