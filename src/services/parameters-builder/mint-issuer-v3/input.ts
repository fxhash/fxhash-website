import { TInputPricing } from "./../pricing/input"

export type TInputMintIssuerV3<N = number, PricingDetails = string> = {
  codex: {
    codex_entry: {
      type: N
      value: string
    }
    codex_id: N
  }
  metadata: string
  input_bytes_size: number
  amount: N
  open_editions: {
    closing_time: number | null
    extra: string
  } | null
  mint_ticket_settings: {
    gracing_period: N
    metadata: string
  } | null
  reserves: {
    amount: N
    data: string
    method_id: N
  }[]
  pricing: TInputPricing<N, PricingDetails>
  primary_split: {
    address: string
    pct: N
  }[]
  royalties: N
  royalties_split: {
    address: string
    pct: N
  }[]
  enabled: boolean
  tags: N[]
}
