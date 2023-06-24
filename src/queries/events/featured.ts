import { gql } from "@apollo/client"
import { Frag_EventMedia } from "queries/fragments/media"

export const getFeaturedQuery = gql`
  ${Frag_EventMedia}

  query GetFeatured {
    featured(where: { id: 1 }) {
      id
      event {
        id
        name
        headerMedia {
          ...MediaDetails
        }
        thumbnailMedia {
          ...MediaDetails
        }
      }
    }
  }
`
