import { GenerativeTokenMetadata } from "../Metadata"
import { Action } from "./Action"
import { Objkt } from "./Objkt"
import { Report } from "./Report"
import { User } from "./User"

export enum GenTokFlag {
  NONE              = "NONE",
  CLEAN             = "CLEAN",
  REPORTED          = "REPORTED",
  AUTO_DETECT_COPY  = "AUTO_DETECT_COPY",
  MALICIOUS         = "MALICIOUS",
}

export interface GenerativeToken {
  id: number
  author: User
  name: string
  flag: GenTokFlag
  reports?: Report[]
  slug?: string
  metadata: GenerativeTokenMetadata
  metadataUri?: string
  tags?: string[]
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