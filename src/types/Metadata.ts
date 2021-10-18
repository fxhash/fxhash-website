import { Vec2 } from "./Math";

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
  uri: string,
  mimeType: string
}

export interface CaptureSettings {
  resolution: Vec2
  delay: number
}

export interface GenerativeTokenMetadata {
  name: string
  description: string
  childrenDescription: string
  tags: string
  // link to the fixed hash project
  artifactUri: string
  // link to the HQ preview image
  displayUri: string
  // link to the thumbnail image
  thumbnailUri: string
  // link to the generative URL project
  generativeUri: string
  authenticityHash: string
  capture: CaptureSettings
}

export interface ObjktMetadata extends GenerativeTokenMetadata {}