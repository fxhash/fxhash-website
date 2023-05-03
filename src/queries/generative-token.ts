import { gql } from "@apollo/client"
import {
  Frag_GenArticleMentions,
  Frag_GenAuthor,
  Frag_GenReserves,
  Frag_GenSplitsPrimary,
  Frag_GenSplitsSecondary,
  Frag_GenTokenInfo,
  Frag_GenTokenRedeemables,
} from "./fragments/generative-token"
import { Frag_UserBadge } from "./fragments/user"
import { Frag_MediaImage } from "./fragments/media"
import { Frag_MintTicketFull } from "./fragments/mint-ticket"
import { Frag_GenTokOffer } from "./fragments/offer"
import { Frag_GenTokCollectionOffer } from "./fragments/collection-offer"

export const Qu_genToken = gql`
  ${Frag_GenTokenInfo}
  ${Frag_GenSplitsPrimary}
  ${Frag_GenSplitsSecondary}
  ${Frag_GenReserves}
  ${Frag_GenArticleMentions}
  ${Frag_GenTokenRedeemables}

  query Query($id: Float, $slug: String) {
    generativeToken(id: $id, slug: $slug) {
      ...TokenInfo
      tags
      moderationReason
      mintOpensAt
      lockEnd
      metadata
      metadataUri
      version
      ...SplitsPrimary
      ...SplitsSecondary
      ...Reserves
      ...ArticleMentions
      ...Redeemables
    }
  }
`

export const Qu_genTokens = gql`
  ${Frag_GenTokenInfo}
  query GenerativeTokens(
    $skip: Int
    $take: Int
    $sort: GenerativeSortInput
    $filters: GenerativeTokenFilter
  ) {
    generativeTokens(skip: $skip, take: $take, sort: $sort, filters: $filters) {
      id
      ...TokenInfo
    }
  }
`

export const Qu_genTokensAuthors = gql`
  ${Frag_GenAuthor}
  query GenerativeTokens($skip: Int, $take: Int, $projectIds: [Int!]) {
    generativeTokens(
      skip: $skip
      take: $take
      filters: { id_in: $projectIds }
    ) {
      id
      ...Author
    }
  }
`

export const Qu_genTokensIncoming = gql`
  ${Frag_GenTokenInfo}
  query GenerativeTokensIncoming(
    $skip: Int
    $take: Int
    $sort: GenerativeSortInput
    $filters: GenerativeTokenFilter
  ) {
    generativeTokens(skip: $skip, take: $take, sort: $sort, filters: $filters) {
      id
      ...TokenInfo
      lockEnd
      mintOpensAt
    }
  }
`

export const Qu_genTokensMarketplaceCollections = gql`
  ${Frag_GenTokenInfo}
  query GenerativeTokens(
    $skip: Int
    $take: Int
    $sort: GenerativeSortInput
    $filters: GenerativeTokenFilter
  ) {
    generativeTokens(skip: $skip, take: $take, sort: $sort, filters: $filters) {
      ...TokenInfo
      marketStats {
        floor
        listed
      }
    }
  }
`

export const Qu_genTokensReported = gql`
  ${Frag_GenTokenInfo}
  query GenerativeTokens(
    $skip: Int
    $take: Int
    $sort: GenerativeSortInput
    $filters: GenerativeTokenFilter
  ) {
    generativeTokens(skip: $skip, take: $take, sort: $sort, filters: $filters) {
      ...TokenInfo
      reports {
        id
        createdAt
      }
    }
  }
`

export const Qu_genTokenMarketplace = gql`
  ${Frag_GenTokenInfo}
  ${Frag_GenReserves}
  query Query($id: Float, $slug: String) {
    generativeToken(id: $id, slug: $slug) {
      ...TokenInfo
      moderationReason
      tags
      metadata
      metadataUri
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
      ...Reserves
    }
  }
`

export const Qu_genTokenIterations = gql`
  ${Frag_MediaImage}
  ${Frag_UserBadge}
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
      objkts(
        take: $take
        skip: $skip
        sort: $sort
        featureFilters: $featureFilters
        filters: $filters
      ) {
        id
        version
        iteration
        issuer {
          id
          flag
          labels
        }
        owner {
          ...UserBadgeInfos
        }
        name
        metadata
        rarity
        activeListing {
          id
          version
          price
        }
        availableRedeemables {
          address
        }
        captureMedia {
          ...MediaImage
        }
      }
    }
  }
`

export const Qu_genTokenMintTickets = gql`
  ${Frag_MintTicketFull}
  query Query(
    $id: Float
    $slug: String
    $ownerId: String
    $skip: Int
    $take: Int
    $now: String
    $sort: MintTicketSortInput
    $filters: MintTicketFilter
  ) {
    generativeToken(id: $id, slug: $slug) {
      id
      mintTicketSettings {
        gracingPeriod
      }
      underAuctionMintTickets {
        ...MintTicketFull
      }
      mintTickets(sort: $sort, skip: $skip, take: $take, filters: $filters) {
        ...MintTicketFull
      }
    }
    userMintTickets: mintTickets(
      sort: { taxationPaidUntil: "ASC" }
      filters: { owner_eq: $ownerId, token_eq: $id, taxationPaidUntil_gt: $now }
      take: 50
      skip: 0
    ) {
      ...MintTicketFull
    }
  }
`

export const Qu_genTokenAllIterations = gql`
  ${Frag_MediaImage}
  query GenerativeTokenIterations($id: Float!) {
    generativeToken(id: $id) {
      id
      entireCollection {
        id
        version
        iteration
        name
        metadata
        captureMedia {
          ...MediaImage
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
  query GenerativeTokenMarketHistory(
    $id: Float
    $filters: MarketStatsHistoryInput!
  ) {
    generativeToken(id: $id) {
      id
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
  ${Frag_GenTokOffer}
  ${Frag_GenTokCollectionOffer}
  query GetGenTokOffers($id: Float, $userId: String, $sort: OffersSortInput) {
    generativeToken(id: $id) {
      id
      name
      isHolder(userId: $userId)
      allOffers(filters: { active_eq: true }, sort: $sort) {
        ... on CollectionOffer {
          ...GenTokCollectionOffer
        }
        ... on Offer {
          ...GenTokOffer
        }
      }
    }
  }
`

export const Qu_genMintTickets = gql`
  ${Frag_MintTicketFull}
  query GetGenMintTickets(
    $id: Float
    $skip: Int
    $take: Int
    $sort: MintTicketSortInput
  ) {
    generativeToken(id: $id) {
      id
      mintTickets(skip: $skip, take: $take, sort: $sort) {
        ...MintTicketFull
      }
    }
  }
`

export const Qu_searchGenTok = gql`
  ${Frag_GenAuthor}
  ${Frag_MediaImage}
  query SearchGenerativeToken(
    $skip: Int
    $take: Int
    $sort: GenerativeSortInput
    $filters: GenerativeTokenFilter
  ) {
    generativeTokens(skip: $skip, take: $take, sort: $sort, filters: $filters) {
      id
      name
      thumbnailUri
      captureMedia {
        ...MediaImage
      }
      ...Author
    }
  }
`
