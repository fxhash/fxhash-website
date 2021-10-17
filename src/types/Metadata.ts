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

export interface GenerativeTokenMetadata {
  name: string
  description: string
  childrenDescription: string
  tags: string[]
  artifactUri: string
  displayUri: string
  thumbnailUri: string
  generativeUri: string
}

export interface ObjktMetadata extends GenerativeTokenMetadata {}