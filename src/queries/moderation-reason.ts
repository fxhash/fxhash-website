import { gql } from "@apollo/client"


export const Qu_moderationReasons = gql`
  query GetModerationReasons {
    moderationReasons {
      id
      reason
    }
  }
`