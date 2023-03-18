import { gql } from "@apollo/client"
import { Frag_UserBadge } from "./user"

export const Frag_MintTicketFull = gql`
  ${Frag_UserBadge}
  fragment MintTicketFull on MintTicket {
    id
    createdAt
    taxationLocked
    taxationStart
    price
    taxationPaidUntil
    settings {
      gracingPeriod
    }
    token {
      id
      name
      slug
    }
    owner {
      id
      ...UserBadgeInfos
    }
  }
`
