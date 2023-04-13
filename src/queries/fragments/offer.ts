import { gql } from "@apollo/client"
import { Frag_MediaImage } from "./media"

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
