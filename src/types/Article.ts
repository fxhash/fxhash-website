import { User } from "./entities/User";
import { Split } from "./entities/Split";
import { Action } from "./entities/Action";
import { GenerativeToken } from "./entities/GenerativeToken";

export interface Article {
  id: string
  date: string
  title: string
  contentHtml: string
  description: string
}

export interface NFTArticle {
  id: number
  slug: string
  title: string
  description: string
  body: string
  tags: string[]
  language: string
  metadataUri: string
  metadata: JSON
  metadataLocked: boolean
  artifactUri: string
  displayUri: string
  thumbnailUri: string
  platforms: string[]
  createdAt: string
  editions: number
  royalties: number
  mintOpHash: string
  ledger: NFTArticleLedger[]
  generativeTokenMentions: NFTArticleGenerativeToken[]
  revisions: NFTArticleRevision[]
  author: User
  royaltiesSplits: Split[]
  actions: Action[]
}
export interface NFTArticleLedger {
  amount: number
  owner: User
  article: Article
}
export interface NFTArticleGenerativeToken {
  line: number
  article: Article
  generativeToken: GenerativeToken
}
export interface NFTArticleRevision {
  iteration: number
  metadataUri: string
  createdAt: string
  opHash: string
}
