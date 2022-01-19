import { Action } from "./Action"
import { GenerativeToken } from "./GenerativeToken"
import { Objkt } from "./Objkt"
import { Offer } from "./Offer"

export interface UserItems {
  generativeTokens?: GenerativeToken[]
  objkts?: Objkt[]
  offers?: Offer[]
  actions?: Action[]
}

export enum UserRole {
  USER              = "USER",
  MODERATOR         = "MODERATOR",
  ADMIN             = "ADMIN",
}

export enum UserFlag {
  NONE          = "NONE",
  REVIEW        = "REVIEW",
  SUSPICIOUS    = "SUSPICIOUS",
  MALICIOUS     = "MALICIOUS",
  VERIFIED      = "VERIFIED",
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
  role: UserRole
  flag: UserFlag
  metadata?: Record<string, any>
  metadataUri?: string
  description?: string
  avatarUri?: string
  generativeTokens?: GenerativeToken[]
  actionsAsIssuer: Action[]
  actionsAsTarget: Action[]
  objkts: Objkt[]
  offers: Offer[]
  createdAt: Date
  updatedAt: Date
  // can be populated to merge the actions, however not returned by api
  actions?: Action[]
}

export interface ConnectedUser extends Partial<User> {
  id: string
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