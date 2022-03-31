export enum EReserveMethod {
  WHITELIST         = "WHITELIST",
  TOKEN_STAKERS     = "TOKEN_STAKERS",
}

export interface IReserve {
  data: any
  amount: number
  method: EReserveMethod,
}