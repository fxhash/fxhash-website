import { gql } from "@apollo/client"
import { Frag_UserBadge } from "./fragments/user"
import { Frag_MediaImage } from "./fragments/media"

/**
 * Get a Generative Token active listings
 */
export const Qu_genTokListings = gql`
  ${Frag_MediaImage}
  ${Frag_UserBadge}
  query GenTokActiveListings(
    $id: Float!
    $filters: ObjktFilter
    $sort: ObjktsSortInput
    $skip: Int
    $take: Int
  ) {
    generativeToken(id: $id) {
      id
      activeListedObjkts(
        filters: $filters
        sort: $sort
        skip: $skip
        take: $take
      ) {
        id
        version
        name
        slug
        duplicate
        metadata
        captureMedia {
          ...MediaImage
        }
        activeListing {
          id
          version
          price
          issuer {
            ...UserBadgeInfos
          }
        }
        owner {
          ...UserBadgeInfos
        }
      }
    }
  }
`

export const Qu_genTokActions = gql`
  ${Frag_UserBadge}
  query GenTokActions(
    $id: Float!
    $skip: Int
    $take: Int
    $filters: ActionFilter
  ) {
    generativeToken(id: $id) {
      id
      actions(skip: $skip, take: $take, filters: $filters) {
        id
        type
        opHash
        numericValue
        metadata
        createdAt
        issuer {
          ...UserBadgeInfos
        }
        target {
          ...UserBadgeInfos
        }
        ticketId
        objkt {
          id
          name
          iteration
        }
        ticketId
        token {
          id
          name
        }
      }
    }
  }
`
