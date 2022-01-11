import { Objkt } from './Objkt'
import { User } from './User'

export interface Offer {
  id: number
  issuer: User
	issuerId: number
  objkt: Objkt
  price: number
  royalties: number
  createdAt: Date
  updatedAt: Date
}

export interface OfferFilters {
  price_gte?: number
  price_lte?: number
  fullyMinted_eq?: boolean
  authorVerified_eq?: boolean
}