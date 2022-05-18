import style from "./ExploreIncoming.module.scss"
import { gql, useQuery } from '@apollo/client'
import { GenerativeToken, GenTokFlag } from '../../types/entities/GenerativeToken'
import { CardsContainer } from '../../components/Card/CardsContainer'
import { GenerativeTokenCard } from '../../components/Card/GenerativeTokenCard'
import { InfiniteScrollTrigger } from '../../components/Utils/InfiniteScrollTrigger'
import { useState, useRef, useEffect, useContext } from 'react'
import { Spacing } from '../../components/Layout/Spacing'
import { CardsLoading } from '../../components/Card/CardsLoading'
import { SettingsContext } from '../../context/Theme'
import { Frag_GenAuthor, Frag_GenPricing } from '../../queries/fragments/generative-token'
import { CardsExplorer } from '../../components/Exploration/CardsExplorer'
import { CardSizeSelect } from "../../components/Input/CardSizeSelect"

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
      displayUri
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
  const settingsCtx = useContext(SettingsContext)

  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore } = useQuery(Qu_genTokens, {
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
  })

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === data.generativeTokens.length) {
        ended.current = true
      }
      else {
        currentLength.current = data.generativeTokens.length
      }
    }
  }, [data, loading])

  const infiniteScrollFetch = () => {
    if (!ended.current) {
      fetchMore({
        variables: {
          skip: data.generativeTokens.length,
          take: ITEMS_PER_PAGE
        }
      })
    }
  }

  const generativeTokens: GenerativeToken[] = data?.generativeTokens

  return (
    <CardsExplorer cardSizeScope="explore">
      {({
	cardSize,
	setCardSize
      }) => (
	<>
	  <div className={style.top_bar}>
	    <CardSizeSelect value={cardSize} onChange={setCardSize}  />
	  </div>
	  <Spacing size="large" />
	  <InfiniteScrollTrigger
	    onTrigger={infiniteScrollFetch}
	    canTrigger={!!data && !loading}
	  >
	    <CardsContainer>
	      {generativeTokens?.length > 0 && generativeTokens.map(token => (
		<GenerativeTokenCard
		  key={token.id}
		  token={token}
		  displayPrice={settingsCtx.displayPricesCard}
		  displayDetails={settingsCtx.displayInfosGenerativeCard}
		  lockedUntil={token.lockEnd as any}
		  useHQ={cardSize >= 400}
		/>
	      ))}
	      {loading && (
		<CardsLoading number={ITEMS_PER_PAGE} />
	      )}
	    </CardsContainer>
	  </InfiniteScrollTrigger>
	</>
      )}
    </CardsExplorer>
  )
}
