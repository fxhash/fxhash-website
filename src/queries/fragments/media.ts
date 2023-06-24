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

export const Frag_EventMedia = gql`
  fragment MediaDetails on Media {
    s3key
    url
    name
  }
`
