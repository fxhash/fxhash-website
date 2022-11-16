export type TInputReserve<N = number> = {
  amount: N
  data: string
  method_id: N
}

export type TInputUpdateReserve<N = number> = {
  issuer_id: N
  reserves: TInputReserve<N>[]
}