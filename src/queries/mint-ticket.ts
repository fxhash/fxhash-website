import { gql } from "@apollo/client"

export const Qu_MintTickets = gql`
  query MintTickets(
    $take: Int
    $skip: Int
    $sort: MintTicketSortInput
    $filters: MintTicketFilter
  ) {
    mintTickets(take: $take, skip: $skip, sort: $sort, filters: $filters) {
      id
    }
  }
`
