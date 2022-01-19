import { gql } from "@apollo/client"

export const Qu_user = gql`
  query Query($id: String, $name: String) {
    user(id: $id, name: $name) {
      id
      name
      metadata
      role
      flag
      description
      avatarUri
      createdAt
    }
  }
`

export const Qu_userGenTokens = gql`
  query Query($id: String!, $take: Int, $skip: Int) {
    user(id: $id) {
      id
      generativeTokens(take: $take, skip: $skip) {
        id
        price
        supply
        originalSupply
        balance
        name
        metadata
        author {
          id
          name
          flag
          metadataUri
          avatarUri
        }
      }
    }
  }
`

export const Qu_userObjkts = gql`
  query Query($id: String!, $take: Int, $skip: Int, $sort: UserCollectionSortInput, $filters: ObjktFilter) {
    user(id: $id) {
      id
      objkts(take: $take, skip: $skip, sort: $sort, filters: $filters) {
        id
        assigned
        rarity
        iteration
        owner {
          id
          name
          flag
          avatarUri
        }
        issuer {
          name
          flag
          author {
            id
            name
            flag
            avatarUri
          }
        }
        name
        metadata
        createdAt
        offer {
          id
          price
        }
      }
    }
  }
`

export const Qu_userOffers = gql`
  query Query($id: String!, $take: Int, $skip: Int) {
    user(id: $id) {
      id
      offers(take: $take, skip: $skip) {
        id
        price
        royalties
        objkt {
          id
          name
          metadata
          owner {
            id
            name
            flag
            avatarUri
          }
          offer {
            price
          }
          issuer {
            flag
            author {
              id
              name
              flag
              avatarUri
            }
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
        type
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
        }
      }
    }
  }
`