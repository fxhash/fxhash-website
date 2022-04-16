import style from "./GenerativeStatsMarketplace.module.scss"
import cs from "classnames"
import colors from "../../styles/Colors.module.css"
import { GenerativeToken, GenerativeTokenMarketStats, GenerativeTokenMarketStatsHistory } from "../../types/entities/GenerativeToken"
import { useQuery } from "@apollo/client"
import { Qu_genTokenMarketHistory } from "../../queries/generative-token"
import { useMemo, useState } from "react"
import { subDays } from "date-fns"
import { useClientAsyncEffect } from "../../utils/hookts"
import { MarketChart } from "../../components/Charts/MarketChart"
import { aggregateBatchesGeneratorMarketStatHistory, aggregateGeneratorMarketStatHistory, cleanGeneratorMarketStatHistory } from "../../utils/stats"
import { cloneDeep } from "@apollo/client/utilities"
import { IOptions, Select } from "../../components/Input/Select"
import { Loader } from "../../components/Utils/Loader"


const MetricOptions: IOptions[] = [
  {
    label: "Volume (tez)",
    value: "secVolumeTz",
  },
  {
    label: "Volume (nb)",
    value: "secVolumeNb",
  },
  {
    label: "Average sales (tez / nb)",
    value: "secVolumeAvg",
  },
  {
    label: "Floor",
    value: "floor",
  },
  {
    label: "Median",
    value: "median",
  },
  {
    label: "Number of items listed",
    value: "listed",
  },
  // {
  //   label: "Highest Sold",
  //   value: "highestSold",
  // },
  // {
  //   label: "Lowest Sold",
  //   value: "lowestSold",
  // },
]

const PeriodOptions: IOptions[] = [
  {
    label: "Last 7 days",
    value: 7,
  },
  {
    label: "Last 30 days",
    value: 30,
  },
  {
    label: "Last 100 days",
    value: 100,
  },
  {
    label: "All time",
    value: 100000,
  }
]

function getStatFromMetric(stat: GenerativeTokenMarketStatsHistory, metric: string): number {
  switch (metric) {
    case "secVolumeTz":
    case "floor":
    case "median":
    case "highestSold":
    case "lowestSold":
      return stat[metric]! / 1000000
    case "secVolumeAvg":
      return stat.secVolumeTz! / 1000000 / (stat.secVolumeNb! || 1)
    default:
      // @ts-ignore
      return stat[metric]!
  }
}

interface Props {
  token: GenerativeToken
}
export function GenerativeStatsMarketplace({
  token,
}: Props) {
  const [period, setPeriod] = useState<number>(30)
  const [metric, setMetric] = useState<string>("secVolumeTz")

  const [from, to] = useMemo(() => {
    const now = new Date()
    const from = subDays(now, period)
    return [from, now]
  }, [period])

  const { data, loading } = useQuery(Qu_genTokenMarketHistory, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: token.id,
      filters: {
        from,
        to
      }
    }
  })

  // format the data
  const formatted = useMemo(() => {
    if (!data || !data.generativeToken.marketStatsHistory) return null
    const history: GenerativeTokenMarketStatsHistory[] = cleanGeneratorMarketStatHistory(cloneDeep(data.generativeToken.marketStatsHistory))


    const batched = aggregateBatchesGeneratorMarketStatHistory(history, 20)
    // const batched24 = aggregateBatchesGeneratorMarketStatHistory(history, 24)

    return batched.map((stat: any) => ({
      time: stat.to,
      value: getStatFromMetric(stat, metric),
    }))
  }, [data, metric])

  return (
    <div>
      <div className={cs(style.inputs)}>
        <div className={cs(style.input_wrapper)}>
          <span>Period:</span>
          <Select
            options={PeriodOptions}
            value={period}
            onChange={setPeriod}
          />
        </div>
        <div className={cs(style.input_wrapper)}>
          <span>Metric:</span>
          <Select
            options={MetricOptions}
            value={metric}
            onChange={setMetric}
          />
        </div>
      </div>

      <div className={cs(style.chart_container, { [style.loading]: loading })}>
        <MarketChart 
          data={formatted}
        />
        {loading && (
          <Loader
            size="small"
            className={cs(style.loader)}
          />
        )}
      </div>
    </div>
  )
}