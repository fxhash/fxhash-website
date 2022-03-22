import { Objkt } from './Objkt'
import { User } from './User'

export interface Listing {
  id: number
  version: number
  issuer: User
	issuerId: number
  objkt: Objkt
  price: number
  royalties: number
  createdAt: Date
  updatedAt: Date
}

export interface ListingFilters {
  price_gte?: string
  price_lte?: string
  fullyMinted_eq?: boolean
  authorVerified_eq?: boolean
  searchQuery_eq?: string
  tokenSupply_lte?: number
  tokenSupply_gte?: number
}