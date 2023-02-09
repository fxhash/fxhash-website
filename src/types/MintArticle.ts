import { ISplit } from "./entities/Split"

export interface MintArticleDistribution<N = string> {
  editions: N
  royalties: N
  royalties_split: ISplit[]
}

export interface MintArticleData<N = string> {
  metadataCid: string
  distribution: MintArticleDistribution<N>
}
