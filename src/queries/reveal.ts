import { gql } from "@apollo/client"

export const Qu_reveal = gql`
  query Reveal($hash: String!) {
    reveal(hash: $hash)
  }
`
