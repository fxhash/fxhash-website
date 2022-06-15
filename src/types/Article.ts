import { User } from "./entities/User";

export interface Article {
  id: string
  date: string
  title: string
  contentHtml: string
  description: string
}

export interface NFTArticle {
  id: number
  createdAt: string
  slug: string
  title: string
  description: string
  tags: string[]
  thumbnailUri: string
  author: User
}
