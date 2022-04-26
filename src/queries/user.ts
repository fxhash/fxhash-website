import { gql } from "@apollo/client"
import { Frag_GenAuthor, Frag_GenPricing } from "./fragments/generative-token"

export const Qu_user = gql`
  query User($id: String, $name: String) {
    user(id: $id, name: $name) {
      id
      type
      name
      metadata
      authorizations
      collaborationContracts {
        id
      }
      flag
      moderationReason
      description
      avatarUri
      createdAt
    }
  }
`

export const Qu_users = gql`
  query Users($filters: UserFilter) {
    users(filters: $filters, skip: 0, take: 500) {
      id
      type
      name
      avatarUri
      flag
    }
  }
`

export const Qu_userLight = gql`
  query UserLight($id: String) {
    user(id: $id) {
      id
      name
      flag
      avatarUri
    }
  }
`

export const Qu_userGenTokens = gql`
  ${Frag_GenAuthor}
  ${Frag_GenPricing}

  query UserGenerativeTokens($id: String!, $take: Int, $skip: Int) {
    user(id: $id) {
      id
      generativeTokens(take: $take, skip: $skip, filters: {
        flag_ne: HIDDEN
      }) {
        id
        supply
        originalSupply
        balance
        name
        thumbnailUri
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

export const Qu_userObjkts = gql`
  ${Frag_GenAuthor}

  query UserCollection(
    $id: String!,
    $take: Int,
    $skip: Int,
    $sort: ObjktsSortInput,
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

export const Qu_userObjktsSubResults = gql`
  query Query($id: String!, $generativeFilters: ObjktFilter, $authorFilters: ObjktFilter) {
    user(id: $id) {
      generativeTokensFromObjktFilters(filters: $generativeFilters) {
        id
        name
        metadata
      } 
      authorsFromObjktFilters(filters: $authorFilters) {
        id
        name
        avatarUri
        flag
      }
    }
  }
`

export const Qu_userListings = gql`
  ${Frag_GenAuthor}

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
          owner {
            id
            name
            flag
            avatarUri
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
          id
          name
          flag
          avatarUri
        }
        target {
          id
          name
          flag
          avatarUri
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
      }
    }
  }
`

export const Qu_userCollaborations = gql`
  query Query($id: String!) {
    user(id: $id) {
      id
      collaborationContracts {
        id
        name
        type
        createdAt
        collaborators {
          id
          name
          avatarUri
          flag
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
  query Collaboration($id: String!) {
    user(id: $id) {
      id
      name
      type
      createdAt
      collaborators {
        id
        name
        avatarUri
        flag
      }
    }
  }
`

export const Qu_searchUser = gql`
  query SearchUser($filters: UserFilter) {
    users(filters: $filters, take: 50, sort: { relevance: "DESC" }) {
      id
      name
      flag
      avatarUri
    }
  }
`