import { gql } from "@apollo/client"
import { Frag_UserBadge } from "./user"

export const Frag_RoyaltySplit = gql`
  ${Frag_UserBadge}
  fragment RoyaltySplit on Split {
    pct
    user {
      ...UserBadgeInfos
    }
  }
`
