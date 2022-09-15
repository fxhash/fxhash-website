import { gql, useQuery } from '@apollo/client'
import { GenerativeToken, GenTokFlag } from '../../types/entities/GenerativeToken'
import { CardsContainer } from '../../components/Card/CardsContainer'
import { GenerativeTokenCard } from '../../components/Card/GenerativeTokenCard'
import { InfiniteScrollTrigger } from '../../components/Utils/InfiniteScrollTrigger'
import { useState, useRef, useEffect, useContext, useCallback } from 'react'
import { Spacing } from '../../components/Layout/Spacing'
import { CardsLoading } from '../../components/Card/CardsLoading'
import { SettingsContext } from '../../context/Theme'
import { Frag_GenAuthor, Frag_GenPricing } from '../../queries/fragments/generative-token'


const ITEMS_PER_PAGE = 20

const Qu_genTokens = gql`
  ${Frag_GenAuthor}
  ${Frag_GenPricing}
  query GenerativeTokensIncoming($skip: Int, $take: Int, $sort: GenerativeSortInput, $filters: GenerativeTokenFilter) {
    generativeTokens(
      skip: $skip, take: $take, sort: $sort, filters: $filters
    ) {
      id
      name
      slug
      flag
      labels
      thumbnailUri
      ...Pricing
      supply
      originalSupply
      balance
      enabled
      lockEnd
      royalties
      createdAt
      reserves {
        amount
      }
      ...Author
    }
  }
`

interface Props {
}

export const ExploreIncomingTokens = ({ }: Props) => {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false);
  const settingsCtx = useContext(SettingsContext)

  const { data, loading, fetchMore } = useQuery<{ generativeTokens: GenerativeToken[] | null }>(Qu_genTokens, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
      filters: {
        mintOpened_eq: false,
        flag_in: [
          GenTokFlag.CLEAN,
          GenTokFlag.NONE,
        ]
      },
      sort: {
        mintOpensAt: "ASC",
      }
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
    onCompleted: (newData) => {
      if (!newData?.generativeTokens?.length || newData.generativeTokens.length < ITEMS_PER_PAGE) {
        setHasNothingToFetch(true);
      }
    }
  })

  const generativeTokens = data?.generativeTokens
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false;
    const { data: newData } = await fetchMore({
      variables: {
        skip: generativeTokens?.length || 0,
        take: ITEMS_PER_PAGE,
      },
    });
    if (!newData?.generativeTokens?.length || newData.generativeTokens.length < ITEMS_PER_PAGE) {
      setHasNothingToFetch(true);
    }
  }, [fetchMore, generativeTokens?.length, hasNothingToFetch, loading])

  return (
    <>
      <Spacing size="large" />

      <InfiniteScrollTrigger
        onTrigger={handleFetchMore}
        canTrigger={!hasNothingToFetch && !loading}
      >
        <CardsContainer>
          {generativeTokens && generativeTokens?.length > 0 && generativeTokens.map(token => (
            <GenerativeTokenCard
              key={token.id}
              token={token}
              displayPrice={settingsCtx.displayPricesCard}
              displayDetails={settingsCtx.displayInfosGenerativeCard}
              lockedUntil={token.lockEnd as any}
            />
          ))}
          {loading && (
            <CardsLoading number={ITEMS_PER_PAGE} />
          )}
        </CardsContainer>
      </InfiniteScrollTrigger>
    </>
  )
}
