export enum EReserveMethod {
  WHITELIST         = "WHITELIST",
  // TOKEN_STAKERS     = "TOKEN_STAKERS",
}

export interface IReserve<GNumber = number> {
  data: any
  amount: GNumber
  method: EReserveMethod,
}