import { gql } from "@apollo/client"

export const Qu_marketStatsCollections = gql`
  query MarketStatsCollections($sort: StatsGenTokSortInput, $take: Int, $skip: Int) {
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
          id
          name
          metadata
          author {
            id
	    name
	    type
	    collaborators {
	      id
	      name
	    }
          }
        }
      }
    }
  }
`
