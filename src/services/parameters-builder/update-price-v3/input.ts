export type TInputUpdatePriceV3<N = number> = {
  issuer_id: N
  pricing: {
    pricing_id: N
    details: string
    lock_for_reserves: boolean
  }
}
