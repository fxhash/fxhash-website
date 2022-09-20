import { gql } from "@apollo/client";
import { Frag_ArticleInfos } from "./article";

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

export const Frag_GenArticleMentions = gql`
  ${Frag_ArticleInfos}

  fragment ArticleMentions on GenerativeToken {
    articleMentions {
      line
      article {
        ...ArticleInfos
      }
    }
  }
`

export const Frag_GenCardInfos = gql`
  ${Frag_GenAuthor}
  ${Frag_GenPricing}
  fragment GenTokenCardInfos on GenerativeToken {
    id
    name
    slug
    thumbnailUri
    flag
    labels
    ...Pricing
    supply
    originalSupply
    balance
    enabled
    royalties
    createdAt
    reserves {
      amount
    }
    ...Author
  }
`
