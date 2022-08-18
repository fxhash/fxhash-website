import { TInputPricing } from "../pricing/input"

export type TInputMintIssuer<N = number, PricingDetails = string> = {
  amount: N
  enabled: boolean
  metadata: string
  pricing: TInputPricing<N, PricingDetails>
  primary_split: {
    address: string
    pct: N
  }[]
  reserves: {
    amount: N
    data: string
    method_id: N
  }[]
  royalties: N
  royalties_split: {
    address: string
    pct: N
  }[]
  tags: N[]
}