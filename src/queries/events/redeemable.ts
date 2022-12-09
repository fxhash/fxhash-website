import { gql } from "@apollo/client"

export const Qu_redeemableDetails = gql`
  query Consumables($where: ConsumableWhereInput) {
    consumables(where: $where) {
      active
      address
      amount
      createdAt
      description
      fa2
      name
      maxConsumptions
      options
      publicDefinition
      splits
      successInfos
    }
  }
`
