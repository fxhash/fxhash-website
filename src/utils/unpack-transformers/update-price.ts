import { TInputUpdatePriceV3 } from "./../../services/parameters-builder/update-price-v3/input"
import type { BigNumber } from "bignumber.js"
import { TInputUpdatePrice } from "../../services/parameters-builder/update-price/input"

export function transformUpdatePriceBigNumbers(
  bnInput: TInputUpdatePrice<BigNumber>
): TInputUpdatePrice<number> {
  return {
    issuer_id: bnInput.issuer_id.toNumber(),
    details: bnInput.details,
  }
}

export function transformUpdatePriceV3BigNumbers(
  bnInput: TInputUpdatePriceV3<BigNumber>
): TInputUpdatePriceV3<number> {
  return {
    issuer_id: bnInput.issuer_id.toNumber(),
    pricing: {
      pricing_id: bnInput.pricing.pricing_id.toNumber(),
      details: bnInput.pricing.details,
      lock_for_reserves: bnInput.pricing.lock_for_reserves,
    },
  }
}
