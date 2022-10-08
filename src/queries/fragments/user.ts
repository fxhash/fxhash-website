import { gql } from "@apollo/client"
import { Frag_MediaImage } from "./media"

export const Frag_UserBadge = gql`
  ${Frag_MediaImage}
  fragment UserBadgeInfos on User {
    id
    name
    avatarUri
    avatarMedia {
      ...MediaImage
    }
    flag
  }
`
