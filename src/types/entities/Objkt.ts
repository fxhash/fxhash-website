import { ObjktMetadata } from "../Metadata"
import { Action } from "./Action"
import { GenerativeToken } from "./GenerativeToken"
import { Offer } from "./Offer"
import { User } from "./User"

export interface Objkt {
  id: number
  issuer: GenerativeToken
  owner?: User|null
  name?: string
  metadata?: ObjktMetadata
  metadataUri: string
  royalties: number
  offer?: Offer
  actions: Action[]
  createdAt: string
  updatedAt: string
}