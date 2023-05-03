import { gql } from "@apollo/client"
import { Frag_MediaImage } from "./media"
import { Frag_UserBadge } from "./user"

export const Frag_UserOffer = gql`
  ${Frag_MediaImage}
  fragment UserOffer on Offer {
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
        id
        marketStats {
          floor
        }
      }
    }
  }
`

export const Frag_GenTokOffer = gql`
  ${Frag_MediaImage}
  ${Frag_UserBadge}
  fragment GenTokOffer on Offer {
    id
    price
    version
    createdAt
    cancelledAt
    acceptedAt
    buyer {
      ...UserBadgeInfos
    }
    objkt {
      id
      iteration
      metadata
      captureMedia {
        ...MediaImage
      }
      owner {
        ...UserBadgeInfos
      }
    }
  }
`
