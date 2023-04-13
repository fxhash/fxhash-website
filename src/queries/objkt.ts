import { gql } from "@apollo/client"
import { Frag_GenAuthor } from "./fragments/generative-token"
import { Frag_MediaImage } from "./fragments/media"
import { Frag_UserBadge } from "./fragments/user"
export const Qu_objkt = gql`
  ${Frag_GenAuthor}
  ${Frag_MediaImage}
  ${Frag_UserBadge}
  query Gentk($id: ObjktId, $slug: String) {
    objkt(id: $id, slug: $slug) {
      id
      version
      royalties
      mintedPrice
      royaltiesSplit {
        pct
        user {
          ...UserBadgeInfos
        }
      }
      assigned
      minter {
        ...UserBadgeInfos
      }
      owner {
        ...UserBadgeInfos
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
        inputBytesSize
        marketStats {
          floor
        }
        ...Author
      }
      metadata
      metadataUri
      captureMedia {
        ...MediaImage
      }
      features
      rarity
      assigned
      duplicate
      iteration
      generationHash
      inputBytes
      createdAt
      activeListing {
        id
        version
        price
        issuer {
          ...UserBadgeInfos
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
          ...UserBadgeInfos
        }
        target {
          ...UserBadgeInfos
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
  ${Frag_UserBadge}
  ${Frag_GenAuthor}
  ${Frag_MediaImage}
  query Query($filters: ObjktFilter, $take: Int) {
    objkts(filters: $filters, take: $take) {
      id
      version
      royalties
      owner {
        ...UserBadgeInfos
      }
      name
      slug
      issuer {
        name
        slug
        labels
        generativeUri
        ...Author
      }
      metadata
      features
      rarity
      assigned
      iteration
      generationHash
      inputBytes
      createdAt
      assignedAt
      captureMedia {
        ...MediaImage
      }
      activeListing {
        id
        version
        price
      }
    }
  }
`
