import { gql, useQuery } from '@apollo/client'
import { GenerativeToken } from '../types/entities/GenerativeToken'
import { CardsContainer } from '../components/Card/CardsContainer'
import { GenerativeTokenCard } from '../components/Card/GenerativeTokenCard'
import { LoaderBlock } from '../components/Layout/LoaderBlock'
import { InfiniteScrollTrigger } from '../components/Utils/InfiniteScrollTrigger'
import { useState, useRef, useEffect } from 'react'
import { Spacing } from '../components/Layout/Spacing'
import { searchIndexGenerative } from '../services/Algolia'
import { AlgoliaSearch } from '../components/Search/AlgoliaSearch'


const ITEMS_PER_PAGE = 10

const Qu_genTokens = gql`
  query Query ($skip: Int, $take: Int) {
    generativeTokens(skip: $skip, take: $take) {
      id
      name
      slug
      metadata
      price
      supply
      balance
      enabled
      royalties
      createdAt
      updatedAt
      author {
        id
        name
        avatarUri
      }
    }
  }
`

const Qu_tokensById = gql`
  query Query($ids: [Float!]!) {
    generativeTokensByIds(ids: $ids) {
      id
      name
      slug
      metadata
      price
      supply
      balance
      enabled
      royalties
      createdAt
      updatedAt
      author {
        id
        name
        avatarUri
      }
    }
  }
`

interface Props {
}

export const ExploreGenerativeTokens = ({}: Props) => {
  const [searchResults, setSearchResults] = useState<GenerativeToken[]|null>(null)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

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
    <>
      <AlgoliaSearch 
        searchIndex={searchIndexGenerative}
        gqlMapQuery={Qu_tokensById}
        onResults={setSearchResults}
        onLoading={setSearchLoading}
      />

      <Spacing size="large" />

      {searchResults ? (
        searchResults.length > 0 ? (
          <CardsContainer>
            {searchResults.map(token => (
              <GenerativeTokenCard key={token.id} token={token}/>
            ))}
          </CardsContainer>
        ):(
          <p>Your query did not yield any results. 😟</p>
        )
      ):(
        generativeTokens?.length > 0 && (
          <InfiniteScrollTrigger onTrigger={infiniteScrollFetch}>
            <CardsContainer>
              {generativeTokens.map(token => (
                <GenerativeTokenCard key={token.id} token={token}/>
              ))}
            </CardsContainer>
          </InfiniteScrollTrigger>
        )
      )}

      {loading && <LoaderBlock height="30vh">loading</LoaderBlock>}
    </>
  )
}
