import { IAddress } from "components/Input/InputAddress"
import { EventMedia } from "./EventMedia"
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

export enum RedeemableUserActionType {
  INPUT_ADDRESS = "INPUT_ADDRESS",
  INPUT_EMAIL = "INPUT_EMAIL",
  INPUT_LIST = "INPUT_LIST",
}

export interface RedeemableUserAction {
  id: string
  type: RedeemableUserActionType
  options: any
}

export interface RedeemablePublicDefinition {
  userActions: RedeemableUserAction[]
}

export interface RedeemableDetails {
  address: string
  name: string
  active: boolean
  amount: number
  createdAt: Date
  expiresAt: string | null
  description: string
  successInfos: string
  fa2: string
  maxConsumptions: number
  options: RedeemableOption[]
  publicDefinition: RedeemablePublicDefinition
  splits: ISplit[]
  medias: {
    index: number
    media: EventMedia
  }[]
}

// type of the Redeemable user action options
export type RedeemableUserActionOptions = {
  [T in RedeemableUserActionType]: {
    [RedeemableUserActionType.INPUT_ADDRESS]: {
      label: string
      hint?: string
    }
    [RedeemableUserActionType.INPUT_EMAIL]: {
      label: string
      hint?: string
    }
    [RedeemableUserActionType.INPUT_LIST]: {
      label: string
      hint?: string
      values: string[]
      multiple: boolean
      placeholder?: string
    }
  }[T]
}

export type RedeemableUserActionInputType = {
  [T in RedeemableUserActionType]: {
    [RedeemableUserActionType.INPUT_ADDRESS]: IAddress
    [RedeemableUserActionType.INPUT_EMAIL]: string
    [RedeemableUserActionType.INPUT_LIST]: string
  }[T]
}
