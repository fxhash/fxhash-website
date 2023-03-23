import { MichelsonMap } from "@taquito/taquito"

export type TInputPricingDutchAuction<N = number> = {
  levels: MichelsonMap<number, N>
  decrement_duration: N
  opens_at: number | null
}
