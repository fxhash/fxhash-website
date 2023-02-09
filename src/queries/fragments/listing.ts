import { gql } from "@apollo/client"
import { Frag_GenAuthor } from "./generative-token"

export const Frag_ListingArticle = gql`
  fragment ListingArticle on Listing {
    id
    amount
    version
    price
    createdAt
    issuer {
      id
      name
      avatarUri
      flag
    }
  }
`

export const Frag_ListingCardInfos = gql`
  ${Frag_GenAuthor}
  fragment ListingCardInfos on Listing {
    id
    version
    price
    objkt {
      id
      version
      name
      slug
      metadata
      captureMedia {
        ...MediaImage
      }
      duplicate
      activeListing {
        id
        version
        price
      }
      owner {
        id
        name
        flag
        avatarUri
      }
      issuer {
        flag
        name
        labels
        ...Author
      }
    }
  }
`
