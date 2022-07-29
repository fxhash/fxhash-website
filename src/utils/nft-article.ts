import { NFTArticle } from "../types/entities/Article";
import { DraftNFTArticle } from "../types/ArticleEditor/Editor";
import { User } from "../types/entities/User";

type GenerateNftArticleFromDraft = (id: string, draft: DraftNFTArticle, user?: User) => NFTArticle;
export const generateNftArticleFromDraft: GenerateNftArticleFromDraft = (id, draft, user) => {
  return ({
    id,
    slug: `preview-${id}`,
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
    language: 'en',
    metadataUri: '',
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
      tags: [],
      language: 'en',
      artifactUri: '',
      displayUri: '',
      thumbnailUri: draft.form.thumbnailUri || '',
      thumbnailCaption: draft.form.thumbnailCaption,
      platforms: []
    },
    metadataLocked: false,
    artifactUri: '',
    displayUri: '',
    thumbnailUri: draft.form.thumbnailUri || '',
    platforms: null,
    createdAt: draft.lastSavedAt,
    editions: parseInt(draft.form.editions),
    royalties: parseFloat(draft.form.royalties) * 10,
    mintOpHash: ''
  })
}
