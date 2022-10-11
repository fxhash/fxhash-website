import { gql } from "@apollo/client"
import { Frag_GenArticleMentions, Frag_GenAuthor, Frag_GenPricing, Frag_GenReserves, Frag_GenSplitsPrimary, Frag_GenSplitsSecondary } from "./fragments/generative-token"

export const Qu_genToken = gql`
  ${Frag_GenAuthor}
  ${Frag_GenPricing}
  ${Frag_GenSplitsPrimary}
  ${Frag_GenSplitsSecondary}
  ${Frag_GenReserves}
  ${Frag_GenArticleMentions}

  query Query($id: Float, $slug: String) {
    generativeToken(id: $id, slug: $slug) {
      id
      name
      flag
      moderationReason
      slug
      tags
      labels
      metadata
      metadataUri
      supply
      originalSupply
      balance
      enabled
      royalties
      lockEnd
      mintOpensAt
      createdAt
      ...Pricing
      ...Author
      ...SplitsPrimary
      ...SplitsSecondary
      ...Reserves
      ...ArticleMentions
    }
  }
`

export const Qu_genTokenMarketplace = gql`
  ${Frag_GenAuthor}
  ${Frag_GenReserves}
  query Query($id: Float, $slug: String) {
    generativeToken(id: $id, slug: $slug) {
      id
      name
      flag
      moderationReason
      slug
      tags
      metadata
      metadataUri
      supply
      originalSupply
      balance
      enabled
      royalties
      lockEnd
      marketStats {
        floor
        median
        highestSold
        lowestSold
        listed
        primVolumeTz
        primVolumeTz
        secVolumeTz
        secVolumeNb
        secVolumeTz24
        secVolumeNb24
      }
      createdAt
      ...Author
      ...Reserves
    }
  }
`

export const Qu_genTokenIterations = gql`
  query GenerativeTokenIterations(
    $id: Float 
    $take: Int 
    $skip: Int
    $sort: ObjktsSortInput 
    $featureFilters: [FeatureFilter!]
    $filters: ObjktFilter
  ) {
    generativeToken(id: $id) {
      id
      objkts(take: $take, skip: $skip, sort: $sort, featureFilters: $featureFilters, filters: $filters) {
        id
        version
        iteration
        issuer {
          flag
          labels
        }
        owner {
          id
          name
          avatarUri
        }
        name
        metadata
        rarity
        activeListing {
          id
          version
          price
        }
      }
    }
  }
`

export const Qu_genTokenAllIterations = gql`
  query GenerativeTokenIterations(
    $id: Float!
  ) {
    generativeToken(id: $id) {
      id
      entireCollection {
        id
        version
        iteration
        name
        metadata
      }
    }
  }
`

export const Qu_genTokenFeatures = gql`
  query GenerativeTokenFeatures($id: Float) {
    generativeToken(id: $id) {
      features
    }
  }
`

export const Qu_genTokenMarketHistory = gql`
  query GenerativeTokenMarketHistory($id: Float, $filters: MarketStatsHistoryInput!) {
    generativeToken(id: $id) {
      id,
      marketStatsHistory(filters: $filters) {
        floor
        median
        from
        to
        listed
        highestSold
        lowestSold
        primVolumeTz
        primVolumeNb
        secVolumeTz
        secVolumeNb
      }
    }
  }
`

export const Qu_genTokOwners = gql`
  query GetGenTokOwners($filters: GenerativeTokenFilter) {
    generativeTokens(filters: $filters) {
      id
      entireCollection {
        owner {
          id
          name
        }
      }
    }
  }
`

export const Qu_genTokOffers = gql`
  query GetGenTokOffers($id: Float) {
    generativeToken(id: $id) {
      id
      offers(filters: { active_eq: true }) {
        id
        price
        version
        createdAt
        cancelledAt
        acceptedAt
        buyer {
          id
          name
        }
        objkt {
          id
          iteration
          metadata
          owner {
            id
          }
        }
      }
    }
  }
`

export const Qu_searchGenTok = gql`
  ${Frag_GenAuthor}

  query SearchGenerativeToken(
    $skip: Int,
    $take: Int,
    $sort: GenerativeSortInput,
    $filters: GenerativeTokenFilter
  ) {
    generativeTokens(
      skip: $skip,
      take: $take, 
      sort: $sort, 
      filters: $filters
    ) {
      id
      name
      thumbnailUri
      ...Author
    }
  }
`
