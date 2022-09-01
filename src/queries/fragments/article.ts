import { gql } from "@apollo/client";
import { Frag_UserBadge } from "./user";
import { Frag_RoyaltySplit } from "./split";

export const Frag_ArticleInfos = gql`
  fragment ArticleInfos on Article {
    id
    createdAt
    slug
    title
    description
    tags
    thumbnailUri
    author {
      ...UserBadgeInfos
    }
  }
  ${Frag_UserBadge}
`;

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
`;
