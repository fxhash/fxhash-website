import { gql } from "@apollo/client"

export const Qu_event = gql`
  query Event($where: EventWhereUniqueInput!) {
    event(where: $where) {
      id
      name
      description
      createdAt
      updatedAt
      startsAt
      endsAt
      projectIds
    }
  }
`

export const Qu_eventMintPass = gql`
  query MintPass($where: MintPassWhereUniqueInput!) {
    mintPass(where: $where) {
      token
      expiresAt
      group {
        address
        event {
          id
        }
      }
    }
  }
`