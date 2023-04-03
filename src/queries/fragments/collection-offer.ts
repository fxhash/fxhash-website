import { gql } from "@apollo/client"
import { Frag_MediaImage } from "./media"

export const Frag_UserCollectionOffer = gql`
  ${Frag_MediaImage}
  fragment UserCollectionOffer on CollectionOffer {
    id
    price
    createdAt
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
