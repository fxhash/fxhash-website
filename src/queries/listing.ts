import { gql } from "@apollo/client"
import { Frag_ListingCardInfos } from "./fragments/listing"

export const Qu_listings = gql`
  ${Frag_ListingCardInfos}
  query Listings(
    $skip: Int
    $take: Int
    $sort: ListingsSortInput
    $filters: ListingFilter
  ) {
    listings(skip: $skip, take: $take, sort: $sort, filters: $filters) {
      ...ListingCardInfos
    }
  }
`
