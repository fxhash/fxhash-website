import { gql } from "@apollo/client"
import { Frag_GenTokenBadge } from "./fragments/generative-token"

export const Qu_marketStatsCollections = gql`
  ${Frag_GenTokenBadge}
  query MarketStatsCollections(
    $sort: StatsGenTokSortInput
    $take: Int
    $skip: Int
  ) {
    marketStats {
      generativeTokens(sort: $sort, take: $take, skip: $skip) {
        floor
        secVolumeTz
        secVolumeNb
        secVolumeTz24
        secVolumeNb24
        secVolumeTz7d
        secVolumeNb7d
        secVolumeTz30d
        secVolumeNb30d
        primVolumeTz
        primVolumeNb
        lowestSold
        highestSold
        median
        listed
        generativeToken {
          ...TokenBadge
          metadata
        }
      }
    }
  }
`
