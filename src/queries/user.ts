import { gql } from "@apollo/client"
import { Frag_GenAuthor, Frag_GenPricing } from "./fragments/generative-token"
import { Frag_ArticleInfos, Frag_ArticleInfosAction } from "./fragments/article"
import { Frag_MediaImage } from "./fragments/media"
import { Frag_UserBadge } from "./fragments/user"
import { Frag_UserOffer } from "./fragments/offer"
import { Frag_UserCollectionOffer } from "./fragments/collection-offer"

export const Qu_user = gql`
  ${Frag_UserBadge}
  query User($id: String, $name: String) {
    user(id: $id, name: $name) {
      ...UserBadgeInfos
      type
      metadata
      authorizations
      collaborationContracts {
        id
      }
      moderationReason
      description
      createdAt
    }
  }
`

export const Qu_users = gql`
  ${Frag_UserBadge}
  query Users(
    $skip: Int
    $take: Int
    $sort: UserSortInput
    $filters: UserFilter
  ) {
    users(filters: $filters, skip: $skip, take: $take, sort: $sort) {
      id
      type
      ...UserBadgeInfos
    }
  }
`

export const Qu_userLight = gql`
  ${Frag_UserBadge}
  query UserLight($id: String) {
    user(id: $id) {
      ...UserBadgeInfos
    }
  }
`

export const Qu_userDailyAlerts = gql`
  query User($id: String, $name: String) {
    user(id: $id, name: $name) {
      id
      mintTickets {
        id
        taxationPaidUntil
      }
    }
  }
`

export const Qu_userFrequentAlerts = gql`
  query User($id: String, $name: String) {
    user(id: $id, name: $name) {
      id
      allOffersReceived(filters: { active_eq: true }) {
        ... on CollectionOffer {
          id
          createdAt
          price
          buyer {
            id
          }
          token {
            id
            name
            marketStats {
              floor
            }
          }
        }
        ... on Offer {
          id
          createdAt
          price
          buyer {
            id
          }
          objkt {
            id
            name
            issuer {
              marketStats {
                floor
              }
            }
          }
        }
      }
    }
  }
`

export const Qu_userGenTokens = gql`
  ${Frag_GenAuthor}
  ${Frag_GenPricing}
  ${Frag_MediaImage}
  query UserGenerativeTokens($id: String!, $take: Int, $skip: Int) {
    user(id: $id) {
      id
      generativeTokens(take: $take, skip: $skip, filters: { flag_ne: HIDDEN }) {
        id
        supply
        originalSupply
        balance
        name
        thumbnailUri
        inputBytesSize
        captureMedia {
          ...MediaImage
        }
        labels
        lockEnd
        ...Author
        ...Pricing
        reserves {
          amount
        }
      }
    }
  }
`
export const Qu_userEntireCollection = gql`
  ${Frag_GenAuthor}

  query UserCollection($id: String!) {
    user(id: $id) {
      id
      entireCollection {
        id
        version
        assigned
        rarity
        iteration
        generationHash
        inputBytes
        issuer {
          name
          flag
          generativeUri
          labels
          ...Author
        }
        minter {
          id
        }
        name
        createdAt
        activeListing {
          id
          version
          price
        }
      }
    }
  }
`

export const Qu_userObjkts = gql`
  ${Frag_GenAuthor}
  ${Frag_MediaImage}
  ${Frag_UserBadge}
  query UserCollection(
    $id: String!
    $take: Int
    $skip: Int
    $sort: ObjktsSortInput
    $filters: ObjktFilter
  ) {
    user(id: $id) {
      id
      objkts(take: $take, skip: $skip, sort: $sort, filters: $filters) {
        id
        version
        assigned
        rarity
        iteration
        generationHash
        captureMedia {
          ...MediaImage
        }
        metadata
        owner {
          ...UserBadgeInfos
        }
        issuer {
          name
          flag
          generativeUri
          labels
          ...Author
          marketStats {
            floor
          }
        }
        name
        createdAt
        activeListing {
          id
          version
          price
        }
      }
    }
  }
`

export const Qu_userArticlesOwned = gql`
  ${Frag_ArticleInfos}
  query UserCollection($id: String!) {
    user(id: $id) {
      id
      articlesOwned {
        amount
        article {
          ...ArticleInfos
        }
      }
    }
  }
`

export const Qu_userObjktsSubResults = gql`
  ${Frag_UserBadge}
  ${Frag_MediaImage}
  query Query(
    $id: String!
    $generativeFilters: ObjktFilter
    $authorFilters: ObjktFilter
  ) {
    user(id: $id) {
      generativeTokensFromObjktFilters(filters: $generativeFilters) {
        id
        name
        captureMedia {
          ...MediaImage
        }
        metadata
      }
      authorsFromObjktFilters(filters: $authorFilters) {
        ...UserBadgeInfos
      }
    }
  }
`

export const Qu_userListings = gql`
  ${Frag_GenAuthor}
  ${Frag_UserBadge}
  ${Frag_MediaImage}
  query UserListings($id: String!, $take: Int, $skip: Int) {
    user(id: $id) {
      id
      listings(take: $take, skip: $skip) {
        id
        version
        price
        royalties
        objkt {
          id
          version
          name
          metadata
          captureMedia {
            ...MediaImage
          }
          owner {
            ...UserBadgeInfos
          }
          activeListing {
            id
            version
            price
          }
          issuer {
            flag
            labels
            ...Author
          }
        }
      }
    }
  }
`

export const Qu_userActions = gql`
  ${Frag_UserBadge}
  query Query($id: String!, $take: Int, $skip: Int) {
    user(id: $id) {
      id
      actions(take: $take, skip: $skip) {
        id
        opHash
        type
        numericValue
        metadata
        createdAt
        issuer {
          ...UserBadgeInfos
        }
        target {
          ...UserBadgeInfos
        }
        token {
          id
          name
        }
        objkt {
          id
          name
          iteration
        }
        ticketId
        article {
          id
          ...ArticleInfosAction
        }
      }
    }
  }
  ${Frag_ArticleInfosAction}
`

export const Qu_userSales = gql`
  ${Frag_UserBadge}
  ${Frag_MediaImage}
  query UserSales($id: String!, $take: Int, $skip: Int) {
    user(id: $id) {
      id
      sales(take: $take, skip: $skip) {
        id
        type
        numericValue
        opHash
        createdAt
        issuer {
          ...UserBadgeInfos
        }
        target {
          ...UserBadgeInfos
        }
        objkt {
          id
          name
          metadata
          captureMedia {
            ...MediaImage
          }
        }
      }
    }
  }
`

export const Qu_userMintTickets = gql`
  ${Frag_MediaImage}
  query UserMintTickets($id: String!) {
    user(id: $id) {
      id
      mintTickets {
        id
        price
        createdAt
        taxationLocked
        taxationPaidUntil
        taxationStart
        settings {
          gracingPeriod
          metadataUri
          metadata
        }
        token {
          id
          slug
          name
          flag
          thumbnailUri
          captureMedia {
            ...MediaImage
          }
        }
      }
    }
  }
`

export const Qu_userOffersReceived = gql`
  ${Frag_UserCollectionOffer}
  ${Frag_UserOffer}
  query UserOffersReceived(
    $id: String!
    $filters: OfferFilter
    $sort: OffersSortInput
  ) {
    user(id: $id) {
      id
      allOffersReceived(filters: $filters, sort: $sort) {
        ... on CollectionOffer {
          ...UserCollectionOffer
        }
        ... on Offer {
          ...UserOffer
        }
      }
    }
  }
`

export const Qu_userOffersSent = gql`
  ${Frag_UserCollectionOffer}
  ${Frag_UserOffer}
  query UserOffersSent($id: String!, $filters: OfferFilter) {
    user(id: $id) {
      id
      allOffersSent(filters: $filters) {
        ... on CollectionOffer {
          ...UserCollectionOffer
        }
        ... on Offer {
          ...UserOffer
        }
      }
    }
  }
`

export const Qu_userAcceptCollectionOffer = gql`
  ${Frag_MediaImage}
  query UserAcceptCollectionOffer($userId: String!, $issuerId: Int!) {
    user(id: $userId) {
      id
      objkts(
        filters: { issuer_in: [$issuerId] }
        sort: { iteration: "ASC" }
        take: 50
      ) {
        id
        version
        name
        iteration
        metadata
        captureMedia {
          ...MediaImage
        }
        owner {
          id
        }
        issuer {
          marketStats {
            floor
          }
        }
        activeListing {
          id
          version
        }
      }
    }
  }
`

export const Qu_userCollaborations = gql`
  ${Frag_MediaImage}
  ${Frag_UserBadge}
  query Query($id: String!) {
    user(id: $id) {
      id
      collaborationContracts {
        id
        name
        type
        createdAt
        collaborators {
          ...UserBadgeInfos
        }
        generativeTokens {
          id
          name
        }
      }
    }
  }
`

export const Qu_collaboration = gql`
  ${Frag_UserBadge}
  query Collaboration($id: String!) {
    user(id: $id) {
      id
      name
      type
      createdAt
      collaborators {
        ...UserBadgeInfos
      }
    }
  }
`

export const Qu_searchUser = gql`
  ${Frag_UserBadge}
  query SearchUser($filters: UserFilter) {
    users(filters: $filters, take: 50, sort: { relevance: "DESC" }) {
      ...UserBadgeInfos
    }
  }
`

export const Qu_userArticles = gql`
  query UserArticles(
    $id: String!
    $skip: Int
    $take: Int
    $sort: ArticleSortInput
    $filters: ArticleFilter
  ) {
    user(id: $id) {
      id
      articles(skip: $skip, take: $take, sort: $sort, filters: $filters) {
        ...ArticleInfos
      }
    }
  }
  ${Frag_ArticleInfos}
`
