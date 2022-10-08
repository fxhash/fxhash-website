import { gql } from "@apollo/client"

export const Frag_MediaImage = gql`
  fragment MediaImage on MediaImage {
    width
    height
    placeholder
    mimeType
    metadata
    processed
  }
`
