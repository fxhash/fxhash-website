import style from "./CollectionRanks.module.scss"
import cs from "classnames"
import { Ranks } from "../../../components/Stats/Ranks"
import { IOptions } from "../../../components/Input/Select"
import { useQuery } from "@apollo/client"
import { useMemo, useState } from "react"
import { Qu_marketStatsCollections } from "../../../queries/stats"
import { GenerativeTokenMarketStats } from "../../../types/entities/GenerativeToken"
import { GenerativeRank } from "../../../components/Stats/GenerativeRank"
import { RankPlaceholder } from "../../../components/Stats/RankPlaceholder"


const sortOptions: IOptions[] = [
  {
    label: "24 hours",
    value: "secVolumeTz24-desc"
  },
  {
    label: "price (high to low)",
    value: "secVolumeTz7d-desc",
  },
  {
    label: "price (low to high)",
    value: "secVolumeTz30d-asc",
  },
]

function sortValueToSortVariable(val: string) {
  if (val === "pertinence") return {}
  const split = val.split("-")
  return {
    [split[0]]: split[1].toUpperCase()
  }
}

interface Props {
  
}
export function CollectionRanks({
  
}: Props) {
  const [sortValue, setSortValue] = useState<string>("secVolumeTz7d-desc")
  const sort = useMemo(() => sortValueToSortVariable(sortValue), [sortValue])
  
  const { data, loading } = useQuery(Qu_marketStatsCollections, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: 15,
      sort,
    }
  })

  const stats: GenerativeTokenMarketStats[] = data?.marketStats?.generativeTokens

  return (
    <Ranks>
      {stats ? (
        stats.map((stat, idx) => (
          <GenerativeRank
            key={idx}
            token={stat.generativeToken!}
          >
            <Tezos
          </GenerativeRank>
        ))
      ):(
        Array(15).fill(0).map((_, idx) => (
          <RankPlaceholder key={idx} />
        ))
      )}
    </Ranks>
  )
}