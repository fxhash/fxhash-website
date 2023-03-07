export enum EReserveMethod {
  WHITELIST = "WHITELIST",
  // TOKEN_STAKERS     = "TOKEN_STAKERS",
  MINT_PASS = "MINT_PASS",
}

export interface IReserve<GNumber = number> {
  data: any
  amount: GNumber
  method: EReserveMethod
}

export interface IReserveMintInput {
  method: EReserveMethod
  data: any
}
