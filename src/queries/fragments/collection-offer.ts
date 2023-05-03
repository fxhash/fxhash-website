import { gql } from "@apollo/client"
import { Frag_MediaImage } from "./media"
import { Frag_UserBadge } from "./user"

export const Frag_UserCollectionOffer = gql`
  ${Frag_MediaImage}
  fragment UserCollectionOffer on CollectionOffer {
    id
    price
    createdAt
    amount
    buyer {
      id
      name
    }
    token {
      id
      name
      marketStats {
        floor
      }
      metadata
      captureMedia {
        ...MediaImage
      }
    }
  }
`

export const Frag_GenTokCollectionOffer = gql`
  ${Frag_MediaImage}
  ${Frag_UserBadge}
  fragment GenTokCollectionOffer on CollectionOffer {
    id
    price
    version
    createdAt
    cancelledAt
    completedAt
    amount
    buyer {
      ...UserBadgeInfos
    }
    token {
      id
      name
      metadata
      captureMedia {
        ...MediaImage
      }
    }
  }
`
