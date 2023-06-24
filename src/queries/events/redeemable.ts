import { gql } from "@apollo/client"
import { Frag_EventMedia } from "queries/fragments/media"

export const Frag_RedeemableBaseDetails = gql`
  fragment RedeemableBaseDetails on Consumable {
    address
    name
  }
`

export const Qu_redeemableBase = gql`
  ${Frag_RedeemableBaseDetails}

  query Consumables($where: ConsumableWhereUniqueInput!) {
    consumable(where: $where) {
      ...RedeemableBaseDetails
    }
  }
`

export const Qu_redeemableDetails = gql`
  ${Frag_RedeemableBaseDetails}
  ${Frag_EventMedia}

  query Consumables($where: ConsumableWhereInput) {
    consumables(where: $where) {
      ...RedeemableBaseDetails
      active
      amount
      createdAt
      expiresAt
      description
      fa2
      maxConsumptions
      options
      publicDefinition
      splits
      successInfos
      medias {
        index
        media {
          ...MediaDetails
        }
      }
    }
  }
`
