import { gql } from "@apollo/client"

export const Qu_genToken = gql`
  query Query($id: Float, $slug: String) {
    generativeToken(id: $id, slug: $slug) {
      id
      name
      flag
      slug
      tags
      metadata
      metadataUri
      price
      supply
      balance
      enabled
      royalties
      objkts: latestObjkts {
        id
        owner {
          id
          name
          avatarUri
        }
        name
        slug
        metadata
        offer {
          issuer {
            id
            name
            avatarUri
          }
          price
        }
        issuer {
          flag
          author {
            id
            name
            avatarUri
          }
        }
      }
      createdAt
      updatedAt
      actions: latestActions {
        id
        type
        metadata
        createdAt
        issuer {
          id
          name
          avatarUri
        }
        target {
          id
          name
          avatarUri
        }
        objkt {
          id
          name
        }
        token {
          id
          name
        }
      }
      author {
        id
        name
        avatarUri
      }
    }
  }
`

export const Qu_genTokenMarketplace = gql`
  query Query($id: Float, $slug: String) {
    generativeToken(id: $id, slug: $slug) {
      id
      name
      flag
      slug
      tags
      metadata
      metadataUri
      price
      supply
      balance
      enabled
      royalties
      marketStats {
        floor
        median
        highestSold
        lowestSold
        totalListing
        primTotal
        secVolumeTz
        secVolumeNb
        secVolumeTz24
        secVolumeNb24
      }
      objkts: latestObjkts {
        id
        owner {
          id
          name
          avatarUri
        }
        name
        slug
        metadata
        offer {
          issuer {
            id
            name
            avatarUri
          }
          price
        }
        issuer {
          flag
          author {
            id
            name
            avatarUri
          }
        }
      }
      createdAt
      updatedAt
      actions: latestActions {
        id
        type
        metadata
        createdAt
        issuer {
          id
          name
          avatarUri
        }
        target {
          id
          name
          avatarUri
        }
        objkt {
          id
          name
        }
        token {
          id
          name
        }
      }
      author {
        id
        name
        avatarUri
      }
    }
  }
`