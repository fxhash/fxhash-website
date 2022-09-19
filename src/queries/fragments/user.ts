import { gql } from "@apollo/client"

export const Frag_UserBadge = gql`
  fragment UserBadgeInfos on User {
    id
    name
    avatarUri
    flag
  }
`;
