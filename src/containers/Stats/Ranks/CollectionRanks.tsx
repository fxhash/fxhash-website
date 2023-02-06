import style from "./CollectionRanks.module.scss"
import cs from "classnames"
import { Ranks } from "../../../components/Stats/Ranks"
import { IOptions, Select } from "../../../components/Input/Select"
import { useQuery } from "@apollo/client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Qu_marketStatsCollections } from "../../../queries/stats"
import { GenerativeTokenMarketStats } from "../../../types/entities/GenerativeToken"
import { GenerativeRank } from "../../../components/Stats/GenerativeRank"
import { RankPlaceholder } from "../../../components/Stats/RankPlaceholder"
import { DisplayTezos } from "../../../components/Display/DisplayTezos"
import { Spacing } from "../../../components/Layout/Spacing"
import useWindowSize, { breakpoints } from "../../../hooks/useWindowsSize"
import { arrayIntoChunks } from "../../../utils/array"
import {
  Carousel,
  CarouselOptions,
} from "../../../components/Carousel/Carousel"
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
  const [page, setPage] = useState(0)
  const { width } = useWindowSize()
  const sort = useMemo(
    () => sortValueToSortVariable(`${sortValue}-desc`),
    [sortValue]
  )
  const handleChangeSelect = useCallback((newSortValue) => {
    setSortValue(newSortValue)
    setPage(0)
  }, [])
  const { data, loading } = useQuery(Qu_marketStatsCollections, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: 50,
      sort,
    },
  })

  const stats: GenerativeTokenMarketStats[] =
    data?.marketStats?.generativeTokens

  const isMobile = useMemo(
    () => width !== undefined && width <= breakpoints.sm,
    [width]
  )

  const pages = useMemo<GenerativeTokenMarketStats[][]>(() => {
    if (!stats || stats.length === 0) return []
    const pageSize = width
      ? width <= breakpoints.sm
        ? 6
        : width <= breakpoints.md
        ? 14
        : 15
      : 15
    return arrayIntoChunks<GenerativeTokenMarketStats>(stats, pageSize)
  }, [width, stats])

  const renderPageStats = useCallback(
    (idx) => {
      const pageStats = pages[idx]
      return (
        <Ranks>
          {pageStats
            ? pageStats.map((stat, idx) => (
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
      )
    },
    [pages, sortValue]
  )
  const options = useMemo<CarouselOptions>(() => {
    return isMobile
      ? {
          showButtonControls: false,
          showDots: true,
        }
      : {
          showButtonControls: true,
          showDots: false,
        }
  }, [isMobile])
  useEffect(() => {
    setPage(0)
  }, [isMobile])
  return (
    <>
      <div className={cs(style.selector)}>
        <span>Highest volume</span>
        <Select
          value={sortValue}
          options={sortOptions}
          onChange={handleChangeSelect}
        />
      </div>
      <Spacing size="x-large" />
      {loading ? (
        <Ranks className={style.placeholder}>
          {Array(isMobile ? 6 : 15)
            .fill(0)
            .map((_, idx) => (
              <RankPlaceholder key={idx} />
            ))}
        </Ranks>
      ) : (
        <Carousel
          className={style.pages}
          page={page}
          totalPages={pages.length}
          onChangePage={setPage}
          renderSlide={renderPageStats}
          options={options}
        />
      )}
    </>
  )
}
