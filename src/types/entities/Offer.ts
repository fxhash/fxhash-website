import { GenerativeToken } from "./GenerativeToken"
import { Objkt } from "./Objkt"
import { User } from "./User"

export interface Offer {
  id: number
  version: number
  buyer: User
  objkt: Objkt
  price: number
  createdAt: string
  cancelledAt: string
  acceptedAt: string
}

export interface CollectionOffer {
  id: number
  version: number
  buyer: User
  token: GenerativeToken
  price: number
  amount: number
  createdAt: string
  cancelledAt: string
  completedAt: string
}

export type AnyOffer = Offer | CollectionOffer

export const offerTypeGuard = (offer: AnyOffer): offer is Offer => {
  return (offer as Offer).objkt !== undefined
}

// export interface OfferFilters {
//   price_gte?: string
//   price_lte?: string
//   fullyMinted_eq?: boolean
//   authorVerified_eq?: boolean
//   searchQuery_eq?: string
//   tokenSupply_lte?: number
//   tokenSupply_gte?: number
// }
