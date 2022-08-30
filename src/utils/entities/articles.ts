import { NFTArticleInfos } from "../../types/entities/Article"

export function getArticleUrl(article: NFTArticleInfos): string {
  return article.slug
    ? `/article/${article.slug}`
    : `/article/id/${article.id}`
}