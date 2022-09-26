import { NFTArticle } from "./Article"
import { GenerativeToken } from "./GenerativeToken"

export interface ArticleGenerativeTokenMention {
  line: number
  article: NFTArticle
  generativeToken: GenerativeToken
}