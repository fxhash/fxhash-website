import { gql } from "@apollo/client"

export const Frag_EventCard = gql`
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
  }
`
