import { gql } from "@apollo/client"

export const Frag_MediaImage = gql`
  fragment MediaImage on MediaImage {
    cid
    width
    height
    placeholder
    mimeType
    metadata
    processed
  }
`
