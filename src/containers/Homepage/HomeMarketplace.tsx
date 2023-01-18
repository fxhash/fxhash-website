import React, { memo, useCallback, useMemo, useState } from "react"
import layout from "../../styles/Layout.module.scss"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import cs from "classnames"
import style from "./HomeMarketplace.module.scss"
import { useQuery } from "@apollo/client"
import { Qu_marketStatsCollections } from "../../queries/stats"
import { GenerativeTokenMarketStats } from "../../types/entities/GenerativeToken"
import { CardSimple } from "../../components/Card/CardSimple"
import { Ranks } from "../../components/Stats/Ranks"
import { GenerativeRank } from "../../components/Stats/GenerativeRank"

type Display = {
  top: GenerativeTokenMarketStats[]
  more: GenerativeTokenMarketStats[]
}
const _HomeMarketplace = () => {
  const [showMore, setShowMore] = useState(false)
  const handleToggleShowMore = useCallback(() => setShowMore((old) => !old), [])
  const { data } = useQuery(Qu_marketStatsCollections, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: 50,
      sort: { secVolumeTz7d: "DESC" },
    },
    pollInterval: 10000,
  })
  const stats: GenerativeTokenMarketStats[] =
    data?.marketStats?.generativeTokens
  const display = useMemo<Display>(() => {
    return !stats
      ? { top: [], more: [] }
      : {
          top: stats.slice(0, 10),
          more: stats.slice(11),
        }
  }, [stats])

  return (
    <div className={cs(layout["padding-big"], style.bg)}>
      <TitleHyphen>marketplace</TitleHyphen>
      <div className={style.top}>
        {display.top.map(({ generativeToken }, idx) => {
          if (!generativeToken) return null
          return (
            <CardSimple
              className={cs({
                [style.card_big]: idx < 4,
              })}
              key={generativeToken.id}
              generativeToken={generativeToken}
            />
          )
        })}
      </div>
      {display.more && (
        <>
          {showMore && (
            <Ranks className={style.ranks}>
              {display.more.map((stat, idx) => (
                <GenerativeRank
                  key={idx}
                  token={stat.generativeToken!}
                  showAuthorBadge
                />
              ))}
            </Ranks>
          )}
          <div className={style.container_show_more}>
            <hr />
            <button type="button" onClick={handleToggleShowMore}>
              show {showMore ? "less" : "more"}{" "}
              <i
                aria-hidden="true"
                className={`fa-solid ${
                  showMore ? "fa-caret-up" : "fa-caret-down"
                }`}
              />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export const HomeMarketplace = memo(_HomeMarketplace)
