import { Collaboration } from "./entities/User"
import { IPricingFixed, IPricingDutchAuction } from "./entities/Pricing"
import { GenerativeTokenMetadata } from "./Metadata"
import { GenTokPricing } from "./entities/GenerativeToken"
import { ISplit } from "./entities/Split"

export interface GenerativeTokenInformations {
  metadata: GenerativeTokenMetadata
  editions: number
  enabled: boolean
  price?: number
  royaties?: number
}

export enum CaptureTriggerMode {
  DELAY             = "DELAY",
  FN_TRIGGER        = "FN_TRIGGER",
}
export const CaptureTriggerModeList = Object.values(CaptureTriggerMode)

export enum CaptureMode {
  CANVAS          = "CANVAS",
  CUSTOM          = "CUSTOM",
  VIEWPORT        = "VIEWPORT",
}
export const CaptureModeList = Object.values(CaptureMode)

export interface CaptureSettings {
  mode: CaptureMode | null
  triggerMode: CaptureTriggerMode | null
  canvasSelector?: string
  delay: number
  resX?: number
  resY?: number
  gpu?: boolean
}

export interface MintGenerativeData {
  // if the project is authored as a collaboration
  collaboration?: Collaboration|null
  // the ipfs uri pointing to the project with URL params
  cidUrlParams?: string
  // a hash to verify that the first matches
  authHash1?: string
  // the hash selector for the preview
  previewHash?: string
  // the ipfs uri to the preview
  cidPreview?: string
  // the ipfs uri to the thumbnail
  cidThumbnail?: string
  // a hash to verify the 2 ipfs uri
  authHash2?: string
  // the distribution parameters
  distribution?: GenTokDistributionForm
  // capture settings
  captureSettings?: CaptureSettings
  // general settings
  settings?: GenTokenSettings
  // general informations about the token
  informations?: GenerativeTokenInformations
  // minted successful
  minted?: boolean
}

export interface GenTokenSettings {
  exploration?: {
    preMint?: {
      enabled: boolean
      hashConstraints?: string[] | null
    },
    postMint?: {
      enabled: boolean
      hashConstraints?: string[] | null
    },
  }
}

export interface GenTokPricingForm {
  pricingMethod?: GenTokPricing
  pricingFixed: Partial<IPricingFixed>
  pricingDutchAuction: Partial<IPricingDutchAuction>
}

export interface GenTokDistributionForm {
  pricing: GenTokPricingForm
  editions?: number
  royalties?: number
  enabled: boolean
  splitsPrimary: ISplit[]
  splitsSecondary: ISplit[]
}

export interface GenTokenInformationsForm {
  name: string,
  description: string
  childrenDescription: string
  tags: string
  editions: number
  enabled: boolean
  price: number
  royalties: number
}