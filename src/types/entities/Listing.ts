import { Objkt } from './Objkt'
import { User } from './User'
import { NFTArticle } from "./Article";

export interface Listing {
  id: number
  version: number
  amount: number
  issuer: User
	issuerId: number
  objkt: Objkt
  price: number
  royalties: number
  createdAt: Date
  updatedAt: Date
  article: NFTArticle
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
