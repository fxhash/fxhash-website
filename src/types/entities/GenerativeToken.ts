import { CSSProperties } from "react"
import { GenerativeTokenMetadata } from "../Metadata"
import { Action } from "./Action"
import { Objkt } from "./Objkt"
import { IPricingDutchAuction, IPricingFixed } from "./Pricing"
import { Report } from "./Report"
import { IReserve } from "./Reserve"
import { ISplit, Split } from "./Split"
import { User } from "./User"

export enum GenTokFlag {
  NONE              = "NONE",
  CLEAN             = "CLEAN",
  REPORTED          = "REPORTED",
  AUTO_DETECT_COPY  = "AUTO_DETECT_COPY",
  MALICIOUS         = "MALICIOUS",
  HIDDEN            = "HIDDEN",
}

export enum GenTokPricing {
  FIXED           = "FIXED",
  DUTCH_AUCTION   = "DUTCH_AUCTION",
}

export enum GenTokLabel {
  EPILEPTIC_TRIGGER   = 0,
  SEXUAL_CONTENT      = 1,
  SENSITIVE           = 2,
  IMAGE_COMPOSITION   = 100,
  ANIMATED            = 101,
  INTERACTIVE         = 102,
}

export enum GenTokLabelGroup {
  WARNING       = "WARNING",
  DETAILS       = "DETAILS",
}

export interface GenTokLabelDefinition {
  label: string
  shortLabel: string
  group: GenTokLabelGroup
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
  generativeUri?: string
  thumbnailUri?: string
  displayUri?: string
  tags?: string[]
  labels?: number[]
  // todo:  remove
  price: number
  pricingFixed?: IPricingFixed
  pricingDutchAuction?: IPricingDutchAuction
  originalSupply: number
  supply: number
  balance: number
  enabled: boolean
  royalties: number
  splitsPrimary: Split[]
  splitsSecondary: Split[]
  reserves: IReserve[]
  lockedSeconds: number
  lockEnd: string
  mintOpensAt: string
  objkts: Objkt[]
  actions: Action[]
  objktsCount?: number
  createdAt: string
  marketStats?: GenerativeTokenMarketStats
  marketStatsHistory?: GenerativeTokenMarketStatsHistory[]
  features?: GenerativeTokenFeature[]
  moderationReason?: string|null
  entireCollection?: Objkt[]
}

export interface GenerativeTokenWithCollection extends GenerativeToken {
  entireCollection: Objkt[]
}

export interface GenerativeTokenFilters {
  id_in?: number[]
  flag_eq?: GenTokFlag
  flag_in?: GenTokFlag[]
  flag_neq?: GenTokFlag
  price_gte?: number
  price_lte?: number
  mintProgress_eq?: "COMPLETED"|"ONGOING"|"ALMOST"
  authorVerified_eq?: boolean
  searchQuery_eq?: string
  supply_lte?: number
  supply_gte?: number
  pricingMethod_eq?: GenTokPricing
  locked_eq?: boolean
  mintOpened_eq?: boolean
}

export interface GenerativeTokenFeatureValue {
  value: string|boolean|number
  occur: number
}

export interface GenerativeTokenFeature {
  name: string
  values: GenerativeTokenFeatureValue[]
}