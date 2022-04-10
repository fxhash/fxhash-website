import { gql } from "@apollo/client"
import { Frag_GenAuthor, Frag_GenPricing, Frag_GenReserves, Frag_GenSplitsPrimary, Frag_GenSplitsSecondary } from "./fragments/generative-token"

export const Qu_genToken = gql`
  ${Frag_GenAuthor}
  ${Frag_GenPricing}
  ${Frag_GenSplitsPrimary}
  ${Frag_GenSplitsSecondary}
  ${Frag_GenReserves}

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
      createdAt
      ...Pricing
      ...Author
      ...SplitsPrimary
      ...SplitsSecondary
      ...Reserves
    }
  }
`

export const Qu_genTokenMarketplace = gql`
  ${Frag_GenAuthor}
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
    }
  }
`

export const Qu_genTokenIterations = gql`
  query GenerativeTokenIterations($id: Float, $take: Int, $skip: Int, $sort: ObjktsSortInput, $featureFilters: [FeatureFilter!]) {
    generativeToken(id: $id) {
      id
      objkts(take: $take, skip: $skip, sort: $sort, featureFilters: $featureFilters) {
        id
        version
        iteration
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