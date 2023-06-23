import { gql } from "@apollo/client"
import {
  Frag_GenAuthor,
  Frag_GenTokenRedeemables,
} from "./fragments/generative-token"
import { Frag_MediaImage } from "./fragments/media"
import { Frag_UserBadge } from "./fragments/user"
import { Frag_GenTokOffer } from "./fragments/offer"
export const Qu_objkt = gql`
  ${Frag_GenAuthor}
  ${Frag_MediaImage}
  ${Frag_UserBadge}
  ${Frag_GenTokOffer}
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
        supply
        iterationsCount
        metadata
        marketStats {
          floor
        }
        redeemables {
          address
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
      availableRedeemables {
        address
        redeemedPercentage
      }
      activeListing {
        id
        version
        price
        issuer {
          ...UserBadgeInfos
        }
      }
      offers(filters: { active_eq: true }) {
        ...GenTokOffer
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
        redeemable {
          address
        }
        ticketId
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
      minter {
        id
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
      availableRedeemables {
        address
      }
    }
  }
`
