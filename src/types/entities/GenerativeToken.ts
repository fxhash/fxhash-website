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
  HIDDEN            = "HIDDEN",
}

export interface GenerativeTokenMarketStats {
  floor: number|null
  median: number|null
  listed: number|null
  highestSold: number|null
  lowestSold: number|null
  primVolumeTz: number|null
  primVolumeNb: number|null
	secVolumeTz: number|null
	secVolumeNb: number|null
	secVolumeTz24: number|null
	secVolumeNb24: number|null
	secVolumeTz7d: number|null
	secVolumeNb7d: number|null
	secVolumeTz30d: number|null
	secVolumeNb30d: number|null
  generativeToken?: GenerativeToken
}

export interface GenerativeTokenMarketStatsHistory {
  floor: number|null
  median: number|null
  listed: number|null
  highestSold: number|null
  lowestSold: number|null
  primVolumeTz: number|null
  primVolumeNb: number|null
	secVolumeTz: number|null
	secVolumeNb: number|null
  from: string
  to: string
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
  originalSupply: number
  supply: number
  balance: number
  enabled: boolean
  royalties: number
  lockedSeconds: number
  lockEnd: Date
  objkts: Objkt[]
  actions: Action[]
  objktsCount: number
  createdAt: Date
  marketStats?: GenerativeTokenMarketStats
  marketStatsHistory?: GenerativeTokenMarketStatsHistory[]
  features?: GenerativeTokenFeature[]
}

export interface GenerativeTokenWithCollection extends GenerativeToken {
  entireCollection: Objkt[]
}

export interface GenerativeTokenFilters {
  price_gte?: number
  price_lte?: number
  mintProgress_eq?: "COMPLETED"|"ONGOING"|"ALMOST"
  authorVerified_eq?: boolean
  searchQuery_eq?: string
  supply_lte?: number
  supply_gte?: number
}

export interface GenerativeTokenFeatureValue {
  value: string|boolean|number
  occur: number
}

export interface GenerativeTokenFeature {
  name: string
  values: GenerativeTokenFeatureValue[]
}