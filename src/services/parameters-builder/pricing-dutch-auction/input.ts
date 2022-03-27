import { MichelsonMap } from "@taquito/taquito"

export type TInputPricingDutchAuction<N = number> = {
  levels: MichelsonMap<number, number>
  decrement_duration: number
  opens_at: number|null
}