import { ArticleFlag, NFTArticle } from "../types/entities/Article"
import { DraftNFTArticle, NFTArticleForm } from "../types/ArticleEditor/Editor"
import { User } from "../types/entities/User"

type GenerateNftArticleFromDraft = (
  id: string,
  draft: DraftNFTArticle,
  user?: User
) => NFTArticle
export const generateNftArticleFromDraft: GenerateNftArticleFromDraft = (
  id,
  draft,
  user
) => {
  return {
    id,
    slug: `preview-${id}`,
    flag: ArticleFlag.NONE,
    author: user,
    ledgers: [],
    generativeTokenJointures: [],
    revisions: [],
    royaltiesSplits: [], // draft.form.royaltiesSplit, // transform
    actions: [],
    title: draft.form.title,
    description: draft.form.abstract,
    body: draft.form.body,
    tags: draft.form.tags,
    language: "en",
    metadataUri: "",
    relatedArticles: [],
    metadata: {
      decimals: 0,
      symbol: "ARTKL",
      name: draft.form.title,
      description: draft.form.abstract,
      minter: user?.id,
      creators: [],
      contributors: [],
      type: "article",
      tags: draft.form.tags,
      language: "en",
      artifactUri: "",
      displayUri: draft.form.thumbnailUri || "",
      thumbnailUri: draft.form.thumbnailUri || "",
      thumbnailCaption: draft.form.thumbnailCaption,
      platforms: [],
    },
    metadataLocked: false,
    artifactUri: "",
    displayUri: draft.form.thumbnailUri || "",
    thumbnailUri: draft.form.thumbnailUri || "",
    thumbnailCaption: draft.form.thumbnailCaption || "",
    platforms: null,
    createdAt: draft.lastSavedAt,
    editions: parseInt(draft.form.editions),
    royalties: parseFloat(draft.form.royalties) * 10,
    mintOpHash: "",
  }
}

/**
 * Given a NFTArticle entity, generates a draft for its edition
 */
export function generateNFTArticleDraft(
  article: NFTArticle
): Partial<NFTArticleForm> {
  return {
    title: article.title,
    thumbnailUri: article.displayUri,
    // todo [#392] remove article.metadata?.thumbnailCaption
    thumbnailCaption:
      article.metadata?.thumbnailCaption || article.thumbnailCaption,
    body: article.body,
    abstract: article.description,
    tags: article.tags,
  }
}
