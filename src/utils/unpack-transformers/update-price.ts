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
