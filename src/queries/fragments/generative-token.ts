import { gql } from "@apollo/client";

export const Frag_GenPricing = gql`
  fragment Pricing on GenerativeToken {
    pricingFixed {
      price
      opensAt
    }
    pricingDutchAuction {
      levels
      restingPrice
      decrementDuration
      opensAt
    }
  }
`

export const Frag_GenAuthor = gql`
  fragment Author on GenerativeToken {
    author {
      id
      name
      type
      avatarUri
      flag
      collaborators {
        id
        name
        avatarUri
        flag
      }
    }
  }
`