import { gql } from "@apollo/client"
import { Frag_EventMedia } from "queries/fragments/media"

export const Qu_event = gql`
  ${Frag_EventMedia}

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
      freeLiveMinting
      thumbnailMedia {
        ...MediaDetails
      }
      headerMedia {
        ...MediaDetails
      }
    }
  }
`

export const Qu_eventDetails = gql`
  ${Frag_EventMedia}

  query EventDetails($where: EventWhereUniqueInput!) {
    event(where: $where) {
      id
      name
      description
      createdAt
      updatedAt
      startsAt
      endsAt
      projectIds
      thumbnailMedia {
        ...MediaDetails
      }
      headerMedia {
        ...MediaDetails
      }
      onboarding {
        id
        enabled
        description
        components(orderBy: { index: desc }) {
          index
          component {
            id
            content
          }
        }
      }
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

export const Qu_eventMintPassGroup = gql`
  query MintPassGroup($where: MintPassGroupWhereUniqueInput!) {
    mintPassGroup(where: $where) {
      address
      label
      event {
        id
        name
      }
    }
  }
`

export const Qu_eventsLiveMintingWallets = gql`
  query EventLiveMintingWallets($where: EventWhereInput!) {
    events(where: $where) {
      id
      name
      description
      liveMintingWallets {
        publicKey
      }
    }
  }
`
