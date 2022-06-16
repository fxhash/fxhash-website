import { gql } from "@apollo/client";
import { Frag_UserBadge } from "./user";

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
