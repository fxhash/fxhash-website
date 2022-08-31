import { ArticleMetadata } from "../Metadata"
import { Action } from "./Action"
import { GenerativeToken } from "./GenerativeToken"
import { Split } from "./Split"
import { User } from "./User"

export enum ArticleFlag {
  NONE              = "NONE",
  CLEAN             = "CLEAN",
  REPORTED          = "REPORTED",
  AUTO_DETECT_COPY  = "AUTO_DETECT_COPY",
  MALICIOUS         = "MALICIOUS",
  HIDDEN            = "HIDDEN",
}

export interface NTFArticleLedger {
  article: NFTArticle
  owner: User
  amount: number
}

export interface NFTArticleRevision {
  article: NFTArticle
  iteration: number
  metadataUri: string
  createdAt: string
  opHash: string
}

export interface NFTArticleGenerativeToken {
  article: NFTArticle
  generativeToken: GenerativeToken
  line: number
}

export type NFTArticleInfos = Pick<NFTArticle, 'id' | 'title' | 'flag' | 'slug' | 'thumbnailUri' | 'description' | 'tags' | 'author' | 'createdAt'>
export interface NFTArticle {
  id: number | string
  slug: string
  author?: User
  ledgers: NTFArticleLedger[]
  generativeTokenJointures: NFTArticleGenerativeToken[]
  revisions: NFTArticleRevision[]
  royaltiesSplits: Split[]
  actions: Action[]
  title: string
  description: string
  body: string
  tags: string[]
  language: string
  metadataUri: string
  metadata: ArticleMetadata
  metadataLocked: boolean
  artifactUri: string
  displayUri: string
  thumbnailUri: string
  thumbnailCaption: string
  platforms?: string[] | null
  createdAt: string
  editions: number
  royalties: number
  mintOpHash: string
  relatedArticles: NFTArticle[]
  flag: ArticleFlag
  moderationReason: string
}

export interface NFTArticleFilters {
  author_eq?: string
  metadataLocked_eq?: string
  editions_lte?: string
  editions_gte?: string
  royalties_lte?: string
  royalties_gte?: string
  searchQuery_eq?: string
  flag_in?: ArticleFlag[]
  flag_eq?: ArticleFlag
  flag_ne?: ArticleFlag
}
