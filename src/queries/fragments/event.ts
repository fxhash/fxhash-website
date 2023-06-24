import { gql } from "@apollo/client"
import { Frag_EventMedia } from "./media"

export const Frag_EventCard = gql`
  ${Frag_EventMedia}

  fragment EventCard on Event {
    id
    name
    startsAt
    endsAt
    projectIds
    location
    imageUrl
    availabilities
    description
    thumbnailMedia {
      ...MediaDetails
    }
    headerMedia {
      ...MediaDetails
    }
  }
`
