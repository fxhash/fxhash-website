import { gql } from "@apollo/client"
import { Frag_GenAuthor } from "./fragments/generative-token"
import { Frag_MediaImage } from "./fragments/media"

export const Qu_listings = gql`
  ${Frag_GenAuthor}
  ${Frag_MediaImage}
  query Listings(
    $skip: Int
    $take: Int
    $sort: ListingsSortInput
    $filters: ListingFilter
  ) {
    listings(skip: $skip, take: $take, sort: $sort, filters: $filters) {
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
  }
`
