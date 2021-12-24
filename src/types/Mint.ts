import { GenerativeTokenMetadata } from "./Metadata"

export interface GenerativeTokenInformations {
  metadata: GenerativeTokenMetadata
  editions: number
  enabled: boolean
  price?: number
  royaties?: number
}

export enum CaptureMode {
  CANVAS          = "CANVAS",
  CUSTOM          = "CUSTOM",
  VIEWPORT        = "VIEWPORT",
}

export interface CaptureSettings {
  mode: CaptureMode | null,
  canvasSelector?: string,
  delay: number,
  resX?: number,
  resY?: number
}

export interface MintGenerativeData {
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
  // capture settings
  captureSettings?: CaptureSettings
  // general informations about the token
  informations?: GenerativeTokenInformations
  // minted successful
  minted: boolean
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