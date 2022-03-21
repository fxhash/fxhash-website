import { gql } from "@apollo/client"
import { Frag_GenAuthor, Frag_GenPricing } from "./fragments/generative-token"

export const Qu_genToken = gql`
  ${Frag_GenAuthor}
  ${Frag_GenPricing}

  query Query($id: Float, $slug: String) {
    generativeToken(id: $id, slug: $slug) {
      id
      name
      flag
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
      createdAt
      ...Pricing
      ...Author
    }
  }
`

export const Qu_genTokenMarketplace = gql`
  query Query($id: Float, $slug: String) {
    generativeToken(id: $id, slug: $slug) {
      id
      name
      flag
      slug
      tags
      metadata
      metadataUri
      price
      supply
      originalSupply
      balance
      enabled
      royalties
      lockEnd
      author {
        id
        name
        avatarUri
      }
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
    }
  }
`

export const Qu_genTokenIterations = gql`
  query GenerativeTokenIterations($id: Float, $take: Int, $skip: Int, $sort: ObjktsSortInput, $featureFilters: [FeatureFilter!]) {
    generativeToken(id: $id) {
      id
      objkts(take: $take, skip: $skip, sort: $sort, featureFilters: $featureFilters) {
        id
        owner {
          id
          name
          avatarUri
        }
        name
        metadata
        rarity
        offer {
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

export const Qu_genTokenObjkts = gql`
  query Query($id: Float, $slug: String, $take: Int, $skip: Int) {
    generativeToken(id: $id, slug: $slug) {
      id
      objkts(take: $take, skip: $skip) {
        id
        owner {
          id
          name
          avatarUri
        }
        issuer {
          author {
            id
            name
            avatarUri
          }
        }
        name
        metadata
        offer {
          price
        }
      }
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