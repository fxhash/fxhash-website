import { gql } from "@apollo/client"

export const Frag_UserBadge = gql`
  fragment UserBadgeInfos on User {
    id
    type
    name
    avatarUri
    flag
  }
`;
