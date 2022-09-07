import { gql } from "@apollo/client"
import { Frag_GenAuthor } from "./fragments/generative-token"

export const Qu_objkt = gql`
  ${Frag_GenAuthor}
  query Gentk($id: Float, $slug: String) {
    objkt(id: $id, slug: $slug) {
      id
      version
      royalties
      royaltiesSplit {
        pct
        user {
          id
          name
          flag
          avatarUri
        }
      }
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
        moderationReason
        slug
        labels
        generativeUri
        marketStats {
          floor
        }
        ...Author
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
      activeListing {
        id
        version
        price
        issuer {
          id
          name
          flag
          avatarUri
        }
      }
      offers(filters: { active_eq: true }) {
        id
        price
        version
        createdAt
        cancelledAt
        acceptedAt
        buyer {
          id
          name
        }
      }
      actions {
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
        objkt {
          name
          id
          iteration
        }
      }
    }
  }
`

export const Qu_objktsFeed = gql`
  ${Frag_GenAuthor}
  query Query($filters: ObjktFilter, $take: Int) {
    objkts(filters: $filters, take: $take) {
      id
      version
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
        generativeUri
        ...Author
      }
      metadata
      features
      rarity
      assigned
      iteration
      generationHash
      createdAt
      assignedAt
      activeListing {
        id
        version
        price
      }
    }
  }
`