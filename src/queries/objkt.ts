import { gql } from "@apollo/client"

export const Qu_objkt = gql`
  query Query($id: Float, $slug: String) {
    objkt(id: $id, slug: $slug) {
      id
      royalties
      owner {
        id
        name
        avatarUri
      }
      name
      slug
      issuer {
        id
        name
        flag
        slug
        metadata
        author {
          id
          name
          avatarUri
        }
      }
      metadata
      features
      rarity
      assigned
      iteration
      generationHash
      createdAt
      offer {
        id
        price
        issuer {
          id
          name
          avatarUri
        }
      }
      actions {
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
        objkt {
          name
          id
        }
      }
    }
  }
`

export const Qu_objktsFeed = gql`
  query Query($filters: ObjktFilter, $take: Int) {
    objkts(filters: $filters, take: $take) {
      id
      royalties
      owner {
        id
        name
        avatarUri
      }
      name
      slug
      issuer {
        id
        name
        slug
        metadata
        author {
          id
          name
          avatarUri
        }
      }
      metadata
      features
      rarity
      assigned
      iteration
      generationHash
      createdAt
      assignedAt
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
  }
`