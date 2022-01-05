import { gql, useQuery } from '@apollo/client'
import { GenerativeToken } from '../../types/entities/GenerativeToken'
import { CardsContainer } from '../../components/Card/CardsContainer'
import { GenerativeTokenCard } from '../../components/Card/GenerativeTokenCard'
import { LoaderBlock } from '../../components/Layout/LoaderBlock'
import { InfiniteScrollTrigger } from '../../components/Utils/InfiniteScrollTrigger'
import { useState, useRef, useEffect, useContext } from 'react'
import { Spacing } from '../../components/Layout/Spacing'
import { searchIndexGenerative } from '../../services/Algolia'
import { AlgoliaSearch } from '../../components/Search/AlgoliaSearch'
import { CardsLoading } from '../../components/Card/CardsLoading'
import { SettingsContext } from '../../context/Theme'


const ITEMS_PER_PAGE = 10

const Qu_genTokens = gql`
  query Query ($skip: Int, $take: Int) {
    lockedGenerativeTokens(skip: $skip, take: $take) {
      id
      name
      slug
      metadata
      price
      supply
      originalSupply
      balance
      enabled
      lockEnd
      royalties
      createdAt
      author {
        id
        name
        avatarUri
        flag
      }
    }
  }
`

interface Props {
}

export const ExploreLockedTokens = ({}: Props) => {
  const settingsCtx = useContext(SettingsContext)

  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore } = useQuery(Qu_genTokens, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE
    }
  })

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === data.lockedGenerativeTokens.length) {
        ended.current = true
      }
      else {
        currentLength.current = data.lockedGenerativeTokens.length
      }
    }
  }, [data, loading])

  const infiniteScrollFetch = () => {
    if (!ended.current) {
      fetchMore({
        variables: {
          skip: data.lockedGenerativeTokens.length,
          take: ITEMS_PER_PAGE
        }
      })
    }
  }

  const generativeTokens: GenerativeToken[] = data?.lockedGenerativeTokens

  return (
    <>
      <Spacing size="large" />

      <InfiniteScrollTrigger onTrigger={infiniteScrollFetch} canTrigger={!!data && !loading}>
        <CardsContainer>
          {generativeTokens?.length > 0 && generativeTokens.map(token => (
            <GenerativeTokenCard
              key={token.id}
              token={token}
              displayPrice={settingsCtx.displayPricesCard}
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
