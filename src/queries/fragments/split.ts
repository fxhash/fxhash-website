import { gql } from "@apollo/client";

export const Frag_RoyaltySplit = gql`
  fragment RoyaltySplit on Split {
    pct
    user {
      id
      name
      avatarUri
      flag
    }
  }
`
