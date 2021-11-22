import { gql } from "@apollo/client"

export const Qu_user = gql`
  query Query($id: String, $name: String) {
    user(id: $id, name: $name) {
      id
      name
      metadata
      role
      description
      avatarUri
      createdAt
      updatedAt
      generativeTokens {
        id
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
      objkts {
        id
        owner {
          id
          name
          avatarUri
        }
        issuer {
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
        updatedAt
        offer {
          id
          price
          issuer {
            id
            name
            avatarUri
          }
        }
      }
      offers {
        id
        price
        royalties
        objkt {
          id
          name
          metadata
          createdAt
          issuer {
            flag
            author {
              id
              name
              avatarUri
            }
          }
          offer {
            price
            issuer {
              id
              name
              avatarUri
            }
          }
        }
        createdAt
        issuer {
          id
          name
          avatarUri
        }
      }
      actionsAsIssuer {
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
      actionsAsTarget {
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