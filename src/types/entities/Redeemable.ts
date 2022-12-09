import { GenerativeToken } from "./GenerativeToken"
import { Redemption } from "./Redemption"
import { ISplit, Split } from "./Split"

export interface Redeemable {
  address: string
  token: GenerativeToken
  baseAmount: number
  maxConsumptionsPerToken: number
  splits: Split[]
  redemptions: Redemption[]
  createdAt: string
}

export interface RedeemableOptionValue {
  label: string
  amount: number
}

export interface RedeemableOption {
  label: string
  values: RedeemableOptionValue[]
}

export interface RedeemableDetails {
  address: string
  name: string
  active: boolean
  amount: number
  createdAt: Date
  description: string
  successInfos: string
  fa2: string
  maxConsumptions: number
  options: RedeemableOption[]
  publicDefinition: any
  splits: ISplit[]
}
