import style from "./ExploreIncoming.module.scss"
import { useQuery } from "@apollo/client"
import {
  GenerativeToken,
  GenTokFlag,
} from "../../types/entities/GenerativeToken"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { GenerativeTokenCard } from "../../components/Card/GenerativeTokenCard"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { useState, useContext, useCallback, Fragment, useMemo } from "react"
import { CardsLoading } from "../../components/Card/CardsLoading"
import { SettingsContext } from "../../context/Theme"
import { CardsExplorer } from "../../components/Exploration/CardsExplorer"
import { CardSizeSelect } from "../../components/Input/CardSizeSelect"
import { Qu_genTokensIncoming } from "../../queries/generative-token"
import {
  getDateSeparator,
  getNewDateSeparatorTracking,
} from "../../utils/date-separator"

const ITEMS_PER_PAGE = 20

type GenerativeTokenWithSeparator = {
  generativeToken: GenerativeToken
  separatorLabel?: string | null
}

interface Props {}

export const ExploreIncomingTokens = ({}: Props) => {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)
  const settingsCtx = useContext(SettingsContext)

  const { data, loading, fetchMore } = useQuery<{
    generativeTokens: GenerativeToken[] | null
  }>(Qu_genTokensIncoming, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
      filters: {
        mintOpened_eq: false,
        flag_in: [GenTokFlag.CLEAN, GenTokFlag.NONE],
      },
      sort: {
        mintOpensAt: "ASC",
      },
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
    onCompleted: (newData) => {
      if (
        !newData?.generativeTokens?.length ||
        newData.generativeTokens.length < ITEMS_PER_PAGE
      ) {
        setHasNothingToFetch(true)
      }
    },
  })

  const generativeTokens = data?.generativeTokens
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        skip: generativeTokens?.length || 0,
        take: ITEMS_PER_PAGE,
      },
    })
    if (
      !newData?.generativeTokens?.length ||
      newData.generativeTokens.length < ITEMS_PER_PAGE
    ) {
      setHasNothingToFetch(true)
    }
  }, [fetchMore, generativeTokens?.length, hasNothingToFetch, loading])

  const generativeTokensWithDateSeparator = useMemo<
    GenerativeTokenWithSeparator[] | null | undefined | false
  >(() => {
    let dataSeparatorTracking = getNewDateSeparatorTracking()
    const todayDate = new Date()
    return (
      generativeTokens &&
      generativeTokens?.length > 0 &&
      generativeTokens.map((token) => {
        const dateSeparatorData = token.mintOpensAt
          ? getDateSeparator(
              dataSeparatorTracking,
              todayDate,
              new Date(token.mintOpensAt)
            )
          : null
        if (dateSeparatorData) {
          dataSeparatorTracking = {
            ...dateSeparatorData.dateSeparatorTracking,
          }
        }
        return {
          generativeToken: token,
          separatorLabel: dateSeparatorData?.separatorLabel,
        }
      })
    )
  }, [generativeTokens])
  return (
    <CardsExplorer cardSizeScope="explore">
      {({ cardSize, setCardSize }) => (
        <>
          <div className={style.top_bar}>
            <CardSizeSelect value={cardSize} onChange={setCardSize} />
          </div>
          <InfiniteScrollTrigger
            onTrigger={handleFetchMore}
            canTrigger={!!data && !loading}
          >
            <CardsContainer>
              {generativeTokensWithDateSeparator &&
                generativeTokensWithDateSeparator.map(
                  ({ generativeToken, separatorLabel }) => {
                    return (
                      <Fragment key={generativeToken.id}>
                        {separatorLabel && (
                          <div className={style.date_separator}>
                            {separatorLabel}
                          </div>
                        )}
                        <GenerativeTokenCard
                          key={generativeToken.id}
                          token={generativeToken}
                          positionMintingState="top"
                          displayPrice={settingsCtx.displayPricesCard}
                          displayDetails={
                            settingsCtx.displayInfosGenerativeCard
                          }
                          lockedUntil={generativeToken.lockEnd as any}
                        />
                      </Fragment>
                    )
                  }
                )}
              {loading &&
                CardsLoading({
                  number: ITEMS_PER_PAGE,
                })}
            </CardsContainer>
          </InfiniteScrollTrigger>
        </>
      )}
    </CardsExplorer>
  )
}
