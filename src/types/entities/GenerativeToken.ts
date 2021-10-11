import { GenerativeTokenMetadata } from "../Metadata"
import { Action } from "./Action"
import { Objkt } from "./Objkt"
import { User } from "./User"

export interface GenerativeToken {
  id: number
  author: User
  name: string
  metadata: GenerativeTokenMetadata
  metadataUri?: string
  price: number
  supply: number
  balance: number
  enabled: boolean
  royalties: number
  objkts: Objkt[]
  actions: Action[]
  createdAt: Date
  updatedAt: Date
}