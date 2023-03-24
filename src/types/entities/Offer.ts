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

// export interface OfferFilters {
//   price_gte?: string
//   price_lte?: string
//   fullyMinted_eq?: boolean
//   authorVerified_eq?: boolean
//   searchQuery_eq?: string
//   tokenSupply_lte?: number
//   tokenSupply_gte?: number
// }
