import algoliasearch from "algoliasearch/lite"


export const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!,
)

export const searchIndexGenerative = algoliaClient.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX_GENERATIVE!)
export const searchIndexMarketplace = algoliaClient.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX_MARKETPLACE!)