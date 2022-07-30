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
      finalPrice
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

export const Frag_GenSplitsPrimary = gql`
  fragment SplitsPrimary on GenerativeToken {
    splitsPrimary {
      pct
      user {
        id
        name
        avatarUri
        flag
      }
    }
  }
`

export const Frag_GenSplitsSecondary = gql`
  fragment SplitsSecondary on GenerativeToken {
    splitsSecondary {
      pct
      user {
        id
        name
        avatarUri
        flag
      }
    }
  }
`

export const Frag_GenReserves = gql`
  fragment Reserves on GenerativeToken {
    reserves {
      data
      amount
      method
    }
  }
`