import { MichelsonMap } from "@taquito/michelson-encoder"

export interface ProfileUpdateCallData {
  metadata: string,
  name: string
}

export interface MintGenerativeCallData {
  amount: number,
  enabled: boolean,
  metadata: string,
  price: number,
  royalties: number,
}

export interface UpdateGenerativeCallData {
  enabled: boolean,
  price: number,
  royalties: number,
  issuer_id: number
}

export interface BurnSupplyCallData {
  amount: number
  issuer_id: number
}

export interface MintCall {
  issuer_id: number,
  price: number
}

export interface PlaceOfferCall {
  ownerAddress: string
  tokenId: number
  price: number
  creatorAddress: string
  royalties: number
}

export interface CancelOfferCall {
  offerId: number
}

export interface CollectCall {
  offerId: number
  price: number
}

export interface ReportCall {
  tokenId: number
}

export interface ModerateCall {
  tokenId: number
  state: number
}

export interface ModerateUserStateCall {
  address: string
  state: number
}