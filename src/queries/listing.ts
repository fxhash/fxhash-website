import { gql } from "@apollo/client"
import { Frag_GenAuthor } from "./fragments/generative-token"


export const Qu_listings = gql`
${Frag_GenAuthor}

query Listings (
  $skip: Int, $take: Int, $sort: ListingsSortInput, $filters: ListingFilter
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
        ...Author
      }
    }
  }
}
`