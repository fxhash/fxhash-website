import { Vec2 } from "./Math";
import { CaptureMode } from "./Mint";

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
  mode: CaptureMode
  resolution?: Vec2
  delay?: number
  canvasSelector?: string
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
  authenticityHash: string
  capture: CaptureSettings
  decimals: number,
  symbol: string
}

export interface ObjktMetadata extends GenerativeTokenMetadata {}