import { Vec2 } from "./Math"
import { CaptureMode, CaptureTriggerMode, GenTokenSettings } from "./Mint"

export interface TokenMetadata {
  "": string
  name: string
  symbol: string
  decimals: number
}

export interface HistoryMetadata {
  [key: string]: any
}

export interface TokenFormat {
  uri: string
  mimeType: string
}

export interface CaptureSettings {
  mode: CaptureMode
  triggerMode: CaptureTriggerMode
  resolution?: Vec2
  delay?: number
  canvasSelector?: string
  gpu?: boolean
}

// token features as they can be exported by a Token
export type RawTokenFeatures = Record<string, any>

// only types allowed for token features
export type TokenFeatureValueType = string | number | boolean

export interface TokenMetadataFeature {
  name: string
  value: TokenFeatureValueType
}

export interface TokenFeature {
  name: string
  value: TokenFeatureValueType
  rarity?: number
}

// errors which can be returned during processing RawTokenFeatures into TokenFeatures
export enum ProcessRawTokenFeatureErrorType {
  UNKNOWN = "UNKNOWN",
  INVALID_PROPERTY_TYPE = "INVALID_PROPERTY_TYPE",
  INVALID_FEATURES_SIGNATURE = "INVALID_FEATURES_SIGNATURE",
}
export const ProcessRawTokenFeatureErrorTypes = Object.values(
  ProcessRawTokenFeatureErrorType
)

// the error thrown during Raw Token Features processing
export type ProcessRawTokenFeatureError = {
  type: ProcessRawTokenFeatureErrorType
  extra?: string
}

export interface GenerativeTokenMetadata {
  name: string
  description: string
  childrenDescription: string
  tags: string[]
  // link to the fixed hash project
  artifactUri: string
  // link to the HQ preview image
  displayUri: string
  // link to the thumbnail image
  thumbnailUri: string
  // link to the generative URL project
  generativeUri: string
  // an authenticity hash given by the backend
  authenticityHash: string
  capture: CaptureSettings
  settings?: GenTokenSettings | null
  decimals: number
  symbol: string
  // ADDED STARTING FROM v0.2
  // a fake transaction hash used for the preview
  previewHash?: string
  previewInputBytes?: string
  version?: string
  // ADDED STARTING FROM v0.3
  params: {
    definition: any
    inputBytesSize: number
  }
}

export interface ObjktMetadata extends GenerativeTokenMetadata {
  features?: TokenMetadataFeature[] | null
}

//
// Articles
//

export interface ArticleMetadata {
  decimals: number
  symbol: "ARTKL"
  name: string
  description: string
  minter?: string
  creators?: string[]
  contributors?: string[]
  type: "article"
  tags: string[]
  language: string
  artifactUri: string
  displayUri: string
  thumbnailUri: string
  thumbnailCaption?: string
  platforms?: string[]
}
