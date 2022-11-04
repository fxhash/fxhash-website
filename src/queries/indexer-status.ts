import { gql } from "@apollo/client"

export const Qu_indexerStatus = gql`
  query IndexerStatus {
    statusIndexing {
      level
      id
      originatedAt
      lastIndexedAt
    }
  }
`
