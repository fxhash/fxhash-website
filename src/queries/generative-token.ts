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
      originalSupply
      balance
      enabled
      royalties
      lockEnd
      author {
        id
        name
        avatarUri
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
      originalSupply
      balance
      enabled
      royalties
      lockEnd
      author {
        id
        name
        avatarUri
      }
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
      createdAt
    }
  }
`

export const Qu_genTokenObjkts = gql`
  query Query($id: Float, $slug: String, $take: Int, $skip: Int) {
    generativeToken(id: $id, slug: $slug) {
      id
      objkts(take: $take, skip: $skip) {
        id
        owner {
          id
          name
          avatarUri
        }
        issuer {
          author {
            id
            name
            avatarUri
          }
        }
        name
        metadata
        offer {
          price
        }
      }
    }
  }
`