import { Action } from "./Action"
import { GenerativeToken } from "./GenerativeToken"
import { Objkt } from "./Objkt"
import { Listing } from "./Listing"
import { Offer } from "./Offer";
import { NFTArticle } from "./Article";

export interface UserItems {
  generativeTokens?: GenerativeToken[]
  objkts?: Objkt[]
  listings?: Listing[]
  actions?: Action[]
}

export enum UserFlag {
  NONE          = "NONE",
  REVIEW        = "REVIEW",
  SUSPICIOUS    = "SUSPICIOUS",
  MALICIOUS     = "MALICIOUS",
  VERIFIED      = "VERIFIED",
}

export enum UserAuthorization {
  TOKEN_MODERATION          = "TOKEN_MODERATION",
  ARTICLE_MODERATION        = "ARTICLE_MODERATION",
  USER_MODERATION           = "USER_MODERATION",
  GOVERNANCE_MODERATION     = "GOVERNANCE_MODERATION",
}

export enum UserType {
  REGULAR               = "REGULAR",
  COLLAB_CONTRACT_V1    = "COLLAB_CONTRACT_V1"
}

export const UserFlagValues: Record<UserFlag, number> = {
  NONE          : 0,
  REVIEW        : 1,
  SUSPICIOUS    : 2,
  MALICIOUS     : 3,
  VERIFIED      : 10,
}

export interface User {
  id: string
  name?: string
  type: UserType
  authorizations: UserAuthorization[]
  flag: UserFlag
  metadata?: Record<string, any>
  metadataUri?: string
  description?: string
  avatarUri?: string
  generativeTokens?: GenerativeToken[]
  sales: Action[]
  actionsAsIssuer: Action[]
  actionsAsTarget: Action[]
  listings: Listing[]
  objkts: Objkt[]
  offers: Listing[]
  offersReceived: Offer[]
  offersSent: Offer[]
  createdAt: Date
  updatedAt: Date
  // can be populated to merge the actions, however not returned by api
  actions?: Action[]
  // is set by aliases to manually enforce platform accounts
  platformOwned?: boolean
  donationAddress?: boolean
  descriptionLight?: string
  // is set by aliases to prevent profile from being linked
  preventLink?: boolean
  // as a regular user, it can have collaboration contracts
  collaborationContracts: Collaboration[]
  moderationReason?: string|null
  articles: NFTArticle[]
}

export interface ConnectedUser extends Partial<User> {
  id: string
  authorizations: UserAuthorization[]
}

export interface Collaboration extends User {
  collaborators: User[]
}

export interface UserAlias {
  // the tz address of the account to alias
  id: string
  // user object will have some properties replaced by the alias
  alias: Partial<User>
}

export interface IUserCollectionFilters {
  issuer_in?: number[]
  assigned_eq?: boolean
  offer_ne?: string
  createdAt_lt?: string
  createdAt_gt?: string
  assignedAt_gt?: string
  assignedAt_lt?: string
  mintProgress_eq?: "COMPLETED"|"ONGOING"|"ALMOST"
  authorVerified_eq?: boolean
  author_in?: string[]
  searchQuery_eq?: string
}

export interface UserFilters {
  searchQuery_eq?: string
}
