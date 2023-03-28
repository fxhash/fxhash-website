import { Collaboration } from "./entities/User"
import { IPricingFixed, IPricingDutchAuction } from "./entities/Pricing"
import { GenerativeTokenMetadata } from "./Metadata"
import { GenTokLabel, GenTokPricing } from "./entities/GenerativeToken"
import { ISplit } from "./entities/Split"
import { IReserve } from "./entities/Reserve"

export interface GenerativeTokenInformations {
  metadata: GenerativeTokenMetadata
  editions: number
  enabled: boolean
  price?: number
  royaties?: number
}

export enum CaptureTriggerMode {
  DELAY = "DELAY",
  FN_TRIGGER = "FN_TRIGGER",
}
export const CaptureTriggerModeList = Object.values(CaptureTriggerMode)

export enum CaptureMode {
  CANVAS = "CANVAS",
  CUSTOM = "CUSTOM",
  VIEWPORT = "VIEWPORT",
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

// object defining the fx(params) when minting a Generative Token
export interface MintGenerativeParams {
  // JSON definition of the params
  definition: any
  // number of bytes required when minting params
  inputBytesSize: number
}

export interface MintGenerativeData<N = string> {
  // if the project is authored as a collaboration
  collaboration?: Collaboration | null
  // the ipfs uri pointing to the project with URL params
  cidUrlParams?: string
  // a hash to verify that the first matches
  authHash1?: string
  // the hash selector for the preview
  previewHash?: string
  // the byte string of param values for the preview
  previewInputBytes?: string | null
  // the ipfs uri to the preview
  cidPreview?: string
  // the ipfs uri to the thumbnail
  cidThumbnail?: string
  // a hash to verify the 2 ipfs uri
  authHash2?: string
  // the distribution parameters
  distribution?: GenTokDistributionForm<N>
  // capture settings
  captureSettings?: CaptureSettings
  // general settings
  settings?: GenTokenSettings
  // fx(params) settings
  params?: MintGenerativeParams
  // general informations about the token
  informations?: GenTokenInformationsForm
  // minted successful
  minted?: boolean
}

export interface GenTokenSettings {
  exploration?: {
    preMint?: {
      enabled: boolean
      hashConstraints?: string[] | null
      paramsConstraints?: string[] | null
    }
    postMint?: {
      enabled: boolean
      hashConstraints?: string[] | null
      paramsConstraints?: string[] | null
    }
  }
}

export interface GenTokPricingForm<N> {
  pricingMethod?: GenTokPricing
  pricingFixed: Partial<IPricingFixed<N>>
  pricingDutchAuction: Partial<IPricingDutchAuction<N>>
  lockForReserves?: boolean
}

export interface GenTokDistributionForm<N> {
  pricing: GenTokPricingForm<N>
  editions?: N
  royalties?: N
  enabled: boolean
  splitsPrimary: ISplit[]
  splitsSecondary: ISplit[]
  reserves: IReserve<N>[]
  gracingPeriod?: N
}

export interface GenTokenInformationsForm {
  name: string
  description: string
  childrenDescription: string
  tags: string
  labels: GenTokLabel[]
}
