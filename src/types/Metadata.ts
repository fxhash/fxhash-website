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
  name: string,
  description: string,
  tags: string[],
  symbol: string,
  artifactUri: string,
  displayUri: string,
  thumbnailUri: string,
  creators: string[],
  formats: TokenFormat[],
  decimals: number,
}

export interface ObjktMetadata extends GenerativeTokenMetadata {}