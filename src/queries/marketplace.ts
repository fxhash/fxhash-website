import { gql } from "@apollo/client"


/**
 * Get a Generative Token active listings
 */
export const Qu_genTokListings = gql`
  query GenTokActiveListings(
    $id: Float!, $filters: ObjktFilter, $sort: ObjktsSortInput, $skip: Int, $take: Int
  ) {
    generativeToken(id: $id) {
      id
      activeListedObjkts(filters: $filters, sort: $sort, skip: $skip, take: $take) {
        id
        version
        name
        slug
        duplicate
        metadata
        activeListing {
          id
          version
          price
          issuer {
            id
            name
            flag
            avatarUri
          }
        }
        owner {
          id
          name
          flag
          avatarUri
        }
      }
    }
  }
`