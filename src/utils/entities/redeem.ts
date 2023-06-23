import { RedeemableDetails } from "types/entities/Redeemable"

export function redeemTotalCost(
  redeemable: RedeemableDetails,
  options: (number | null)[]
): number {
  let cost = redeemable.amount
  for (let i = 0; i < redeemable.options.length; i++) {
    const opt = redeemable.options[i]
    if (options[i] != null) {
      cost += opt.values[options[i] as number].amount
    }
  }
  return cost
}
