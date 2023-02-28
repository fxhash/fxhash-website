import type { BigNumber } from "bignumber.js"
import {
  TInputPricing,
  TInputPricingDetails,
} from "../../services/parameters-builder/pricing/input"
import { TInputPricingFixed } from "../../services/parameters-builder/pricing-fixed/input"
import {
  EBuildableParams,
  unpackBytes,
} from "../../services/parameters-builder/BuildParameters"

export function unpackPricingDetails(
  pricing: TInputPricing<BigNumber>
): TInputPricingDetails<BigNumber> {
  const id = pricing.pricing_id.toNumber()
  let type: EBuildableParams = EBuildableParams.PRICING_FIXED
  // 0 = pricing fixed
  if (id === 0) {
    type = EBuildableParams.PRICING_FIXED
  } else if (id === 1) {
    type = EBuildableParams.PRICING_DUTCH_AUCTION
  }
  return unpackBytes<TInputPricingDetails<BigNumber>>(pricing.details, type)
}
