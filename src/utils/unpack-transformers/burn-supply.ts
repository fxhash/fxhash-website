import type { BigNumber } from "bignumber.js"
import { TInputBurnSupply } from "../../services/parameters-builder/burn-supply/input"

export function transformBurnSupplyBigNumbers(
  bnInput: TInputBurnSupply<BigNumber>
): TInputBurnSupply<number> {
  return {
    issuer_id: bnInput.issuer_id.toNumber(),
    amount: bnInput.amount.toNumber(),
  }
}
