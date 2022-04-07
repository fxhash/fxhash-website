import type { BigNumber } from "bignumber.js"
import { TInputReserve, TInputUpdateReserve } from "../../services/parameters-builder/update-reserve/input"

export function transformReserveBigNumbers(
  input: TInputReserve<BigNumber>
): TInputReserve<number> {
  return {
    amount: input.amount.toNumber(),
    data: input.data,
    method_id: input.method_id.toNumber(),
  }
}

export function transformUpdateReserveBigNumbers(
  bnInput: TInputUpdateReserve<BigNumber>
): TInputUpdateReserve<number> {
  return {
    issuer_id: bnInput.issuer_id.toNumber(),
    reserves: bnInput.reserves.map(
      reserve => transformReserveBigNumbers(reserve)
    )
  }
}