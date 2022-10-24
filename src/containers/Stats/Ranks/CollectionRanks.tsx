import style from "./CollectionRanks.module.scss"
import cs from "classnames"
import { Ranks } from "../../../components/Stats/Ranks"
import { IOptions, Select } from "../../../components/Input/Select"
import { useQuery } from "@apollo/client"
import { useMemo, useState } from "react"
import { Qu_marketStatsCollections } from "../../../queries/stats"
import { GenerativeTokenMarketStats } from "../../../types/entities/GenerativeToken"
import { GenerativeRank } from "../../../components/Stats/GenerativeRank"
import { RankPlaceholder } from "../../../components/Stats/RankPlaceholder"
import { DisplayTezos } from "../../../components/Display/DisplayTezos"
import { Spacing } from "../../../components/Layout/Spacing"

const sortOptions: IOptions[] = [
  {
    label: "24 hours",
    value: "secVolumeTz24",
  },
  {
    label: "7 days",
    value: "secVolumeTz7d",
  },
  {
    label: "30 days",
    value: "secVolumeTz30d",
  },
  {
    label: "all time",
    value: "secVolumeTz",
  },
]

function sortValueToSortVariable(val: string) {
  if (val === "pertinence") return {}
  const split = val.split("-")
  return {
    [split[0]]: split[1].toUpperCase(),
  }
}

interface Props {}
export function CollectionRanks({}: Props) {
  const [sortValue, setSortValue] = useState<string>("secVolumeTz7d")
  const sort = useMemo(
    () => sortValueToSortVariable(`${sortValue}-desc`),
    [sortValue]
  )

  const { data, loading } = useQuery(Qu_marketStatsCollections, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: 15,
      sort,
    },
  })

  const stats: GenerativeTokenMarketStats[] =
    data?.marketStats?.generativeTokens

  return (
    <>
      <div className={cs(style.selector)}>
        <span>Highest volume</span>
        <Select
          classNameRoot={style.select}
          value={sortValue}
          options={sortOptions}
          onChange={setSortValue}
        />
      </div>
      <Spacing size="x-large" sm="large" />
      <Ranks>
        {stats
          ? stats.map((stat, idx) => (
              <GenerativeRank key={idx} token={stat.generativeToken!}>
                <DisplayTezos
                  // @ts-ignore
                  mutez={stat[sortValue]}
                  className="price"
                  formatBig
                />
              </GenerativeRank>
            ))
          : Array(15)
              .fill(0)
              .map((_, idx) => <RankPlaceholder key={idx} />)}
      </Ranks>
    </>
  )
}
