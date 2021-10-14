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

export interface User {
  id: string
  name?: string
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