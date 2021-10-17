import { GenerativeTokenMetadata } from "./Metadata"

export interface GenerativeTokenInformations {
  metadata: GenerativeTokenMetadata
  editions: number
  enabled: boolean
  price?: number
  royaties?: number
}

export interface CaptureSettings {
  delay: number,
  resX: number,
  resY: number
}

export interface MintGenerativeData {
  // the ipfs uri pointing to the project with URL params
  cidUrlParams?: string
  // a hash to verify that the first matches
  authHash1?: string
  // the ipfs uri pointing to the project with fixed hash
  cidFixedHash?: string
  // a hash to verify both IPFS
  authHash2?: string
  // the ipfs uri to the preview
  cidPreview?: string
  // the ipfs uri to the thumbnail
  cidThumbnail?: string
  // a hash to verify the 3 ipfs uri
  authHash3?: string
  // capture settings
  captureSettings?: CaptureSettings
  // general informations about the token
  informations?: GenerativeTokenInformations
}

export interface GenTokenInformationsForm {
  name: string,
  description: string
  childrenDescription: string
  tags: string[]
  editions: number
  enabled: boolean
  price: number
  royalties: number
}