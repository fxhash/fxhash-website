import { gql } from "@apollo/client"
import { Frag_UserBadge } from "./user"
import { Frag_RoyaltySplit } from "./split"

export const Frag_ArticleInfosAction = gql`
  fragment ArticleInfosAction on Article {
    id
    slug
    title
    revisions {
      metadataUri
      iteration
      createdAt
    }
  }
`
export const Frag_ArticleInfos = gql`
  fragment ArticleInfos on Article {
    id
    createdAt
    slug
    title
    flag
    description
    tags
    thumbnailUri
    author {
      ...UserBadgeInfos
    }
  }
  ${Frag_UserBadge}
`

export const Frag_ArticleFull = gql`
  fragment ArticleFull on Article {
    id
    createdAt
    slug
    title
    description
    thumbnailUri
    thumbnailCaption
    displayUri
    body
    tags
    language
    editions
    royalties
    metadataUri
    metadata
    metadataLocked
    flag
    moderationReason
    author {
      ...UserBadgeInfos
    }
    royaltiesSplits {
      ...RoyaltySplit
    }
    relatedArticles(take: 4) {
      ...ArticleInfos
    }
    revisions {
      iteration
      metadataUri
      createdAt
      opHash
    }
  }
  ${Frag_ArticleInfos}
  ${Frag_UserBadge}
  ${Frag_RoyaltySplit}
`
