import { ObjktMetadata, TokenFeature } from "../Metadata"
import { Action } from "./Action"
import { GenerativeToken } from "./GenerativeToken"
import { Offer } from "./Offer"
import { User } from "./User"

export interface Objkt {
  id: number
  issuer: GenerativeToken
  owner?: User|null
  assigned?: boolean
  generationHash?: string
  iteration?: number
  tags: string[]
  name?: string
  slug?: string
  metadata?: ObjktMetadata
  features?: TokenFeature[] | null
  rarity?: number
  metadataUri: string
  royalties: number
  offer?: Offer
  actions: Action[]
  createdAt: string
  updatedAt: string
}