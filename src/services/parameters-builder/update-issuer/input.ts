export type TInputUpdateIssuer<N = number> = {
  enabled: boolean
  issuer_id: N
  primary_split: {
    address: string
    pct: N
  }[]
  royalties: N
  royalties_split: {
    address: string
    pct: N
  }[]
}