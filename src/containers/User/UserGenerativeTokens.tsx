// import style from "./UserGenerativeTokens.module.scss"
import layout from "../../styles/Layout.module.scss"
import { useQuery } from "@apollo/client"
import cs from "classnames"
import { useRef, useEffect, useContext, useCallback, useState } from "react"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { GenerativeTokenCard } from "../../components/Card/GenerativeTokenCard"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { SettingsContext } from "../../context/Theme"
import { Qu_userGenTokens } from "../../queries/user"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { User } from "../../types/entities/User"
import { CardsLoading } from "../../components/Card/CardsLoading"

const ITEMS_PER_PAGE = 20
interface Props {
  user: User
}
export function UserGenerativeTokens({ user }: Props) {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)

  const settings = useContext(SettingsContext)

  const { data, loading, fetchMore } = useQuery<{ user: User }>(
    Qu_userGenTokens,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        id: user.id,
        skip: 0,
        take: ITEMS_PER_PAGE,
      },
      onCompleted: (newData) => {
        if (
          !newData?.user?.generativeTokens?.length ||
          newData.user.generativeTokens.length < ITEMS_PER_PAGE
        ) {
          setHasNothingToFetch(true)
        }
      },
    }
  )

  // safe access to gentoks
  const genToks = data?.user?.generativeTokens || null

  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        skip: genToks?.length || 0,
        take: ITEMS_PER_PAGE,
      },
    })
    if (
      !newData?.user?.generativeTokens?.length ||
      newData.user.generativeTokens.length < ITEMS_PER_PAGE
    ) {
      setHasNothingToFetch(true)
    }
  }, [fetchMore, genToks?.length, hasNothingToFetch, loading])

  return (
    <div className={cs(layout["padding-big"])}>
      {!loading && !genToks?.length && (
        <div>No generative art token made yet</div>
      )}
      <InfiniteScrollTrigger
        onTrigger={handleFetchMore}
        canTrigger={!loading && !hasNothingToFetch}
      >
        <CardsContainer cardSize={270}>
          {genToks?.map((token) => (
            <GenerativeTokenCard
              key={token.id}
              token={token}
              displayPrice={settings.displayPricesCard}
              displayDetails={settings.displayInfosGenerativeCard}
            />
          ))}
          {loading &&
            CardsLoading({
              number: ITEMS_PER_PAGE,
            })}
        </CardsContainer>
      </InfiniteScrollTrigger>
    </div>
  )
}
