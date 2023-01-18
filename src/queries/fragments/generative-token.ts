import { gql } from "@apollo/client"
import { Frag_ArticleInfos } from "./article"
import { Frag_MediaImage } from "./media"
import { Frag_UserBadge } from "./user"

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
  ${Frag_MediaImage}
  ${Frag_UserBadge}
  fragment Author on GenerativeToken {
    author {
      ...UserBadgeInfos
      type
      collaborators {
        ...UserBadgeInfos
      }
    }
  }
`

export const Frag_GenSplitsPrimary = gql`
  ${Frag_UserBadge}
  fragment SplitsPrimary on GenerativeToken {
    splitsPrimary {
      pct
      user {
        ...UserBadgeInfos
      }
    }
  }
`

export const Frag_GenSplitsSecondary = gql`
  ${Frag_UserBadge}
  fragment SplitsSecondary on GenerativeToken {
    splitsSecondary {
      pct
      user {
        ...UserBadgeInfos
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

export const Frag_GenTokenBadge = gql`
  ${Frag_GenAuthor}
  ${Frag_MediaImage}
  fragment TokenBadge on GenerativeToken {
    id
    name
    thumbnailUri
    displayUri
    labels
    captureMedia {
      ...MediaImage
    }
    ...Author
  }
`

export const Frag_GenTokenInfo = gql`
  ${Frag_GenPricing}
  ${Frag_GenTokenBadge}
  fragment TokenInfo on GenerativeToken {
    ...TokenBadge
    id
    slug
    flag
    labels
    supply
    originalSupply
    balance
    enabled
    royalties
    createdAt
    reserves {
      amount
    }
    ...Pricing
  }
`
