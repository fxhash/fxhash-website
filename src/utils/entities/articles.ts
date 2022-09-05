import { ArticleFlag, NFTArticleInfos } from "../../types/entities/Article"

const flagged: ArticleFlag[] = [
  ArticleFlag.AUTO_DETECT_COPY,
  ArticleFlag.HIDDEN,
  ArticleFlag.MALICIOUS,
  ArticleFlag.REPORTED
]

export function getArticleUrl(article: NFTArticleInfos): string {
  return isValidSlug(article.slug) && !isArticleFlagged(article)
    ? `/article/${article.slug}`
    : `/article/id/${article.id}`
}

export function isArticleFlagged(article: NFTArticleInfos): boolean {
  return flagged.includes(article.flag)
}

export function isValidSlug(slug: string): boolean {
  return !(!slug || (slug[0] === '.' && slug.length === 1));
}
