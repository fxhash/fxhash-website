import { Action } from "./Action";
import { GenerativeToken } from "./GenerativeToken"
import { Objkt } from "./Objkt";
import { Offer } from "./Offer";

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
}