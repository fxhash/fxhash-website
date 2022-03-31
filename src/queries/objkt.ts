import { gql } from "@apollo/client"

export const Qu_objkt = gql`
  query Query($id: Float, $slug: String) {
    objkt(id: $id, slug: $slug) {
      id
      royalties
      assigned
      owner {
        id
        name
        flag
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
          flag
          avatarUri
        }
      }
      metadata
      metadataUri
      features
      rarity
      assigned
      duplicate
      iteration
      generationHash
      createdAt
      offer {
        id
        price
        issuer {
          id
          name
          flag
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
          flag
          avatarUri
        }
        target {
          id
          name
          flag
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
        flag
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
          flag
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
      }
    }
  }
`