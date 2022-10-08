import { gql } from "@apollo/client"
import { Frag_GenAuthor, Frag_GenPricing } from "./fragments/generative-token"
import { Frag_ArticleInfos, Frag_ArticleInfosAction } from "./fragments/article"
import { Frag_MediaImage } from "./fragments/media"
import { Frag_UserBadge } from "./fragments/user"

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
  query Users($filters: UserFilter) {
    users(filters: $filters, skip: 0, take: 500) {
      ...UserBadgeInfos
      type
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
        issuer {
          name
          flag
          generativeUri
          ...Author
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
          id
          name
          flag
          avatarUri
        }
        issuer {
          name
          flag
          generativeUri
          ...Author
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
  query Query(
    $id: String!
    $generativeFilters: ObjktFilter
    $authorFilters: ObjktFilter
  ) {
    user(id: $id) {
      generativeTokensFromObjktFilters(filters: $generativeFilters) {
        id
        name
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

export const Qu_userOffersReceived = gql`
  ${Frag_MediaImage}
  query UserOffersReceived($id: String!, $filters: OfferFilter) {
    user(id: $id) {
      id
      offersReceived(filters: $filters) {
        id
        price
        createdAt
        buyer {
          id
          name
        }
        objkt {
          id
          version
          name
          metadata
          captureMedia {
            ...MediaImage
          }
          activeListing {
            id
            version
          }
          owner {
            id
          }
          issuer {
            marketStats {
              floor
            }
          }
        }
      }
    }
  }
`

export const Qu_userOffersSent = gql`
  ${Frag_MediaImage}
  query UserOffersSent($id: String!, $filters: OfferFilter) {
    user(id: $id) {
      id
      offersSent(filters: $filters) {
        id
        price
        createdAt
        buyer {
          id
        }
        objkt {
          id
          version
          name
          metadata
          captureMedia {
            ...MediaImage
          }
          owner {
            id
            name
          }
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
