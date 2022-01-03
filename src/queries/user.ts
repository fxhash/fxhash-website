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
        balance
        name
        metadata
        author {
          id
          name
          metadataUri
          avatarUri
        }
      }
    }
  }
`

export const Qu_userObjkts = gql`
  query Query($id: String!, $take: Int, $skip: Int) {
    user(id: $id) {
      id
      objkts(take: $take, skip: $skip) {
        id
        assigned
        iteration
        owner {
          id
          name
          avatarUri
        }
        issuer {
          name
          flag
          author {
            id
            name
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
          avatarUri
        }
        target {
          id
          name
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