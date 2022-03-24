import style from "./MarketplaceCollections.module.scss"
import cs from "classnames"
import { gql, useQuery } from '@apollo/client'
import { GenerativeToken } from '../../types/entities/GenerativeToken'
import { CardsContainer } from '../../components/Card/CardsContainer'
import { GenerativeTokenCard } from '../../components/Card/GenerativeTokenCard'
import { LoaderBlock } from '../../components/Layout/LoaderBlock'
import { InfiniteScrollTrigger } from '../../components/Utils/InfiniteScrollTrigger'
import { useState, useRef, useEffect } from 'react'
import { Spacing } from '../../components/Layout/Spacing'
import { searchIndexGenerative } from '../../services/Algolia'
import { AlgoliaSearch } from '../../components/Search/AlgoliaSearch'
import { CardListsContainer } from "../../components/Card/CardListsContainer"
import { GenerativeTokenCardList } from "../../components/Card/GenerativeTokenCardList"
import { getGenerativeTokenMarketplaceUrl } from "../../utils/generative-token"
import { Frag_GenAuthor, Frag_GenPricing } from "../../queries/fragments/generative-token"


const ITEMS_PER_PAGE = 10

const Qu_genTokens = gql`
  ${Frag_GenAuthor}
  ${Frag_GenPricing}

  query Query ($skip: Int, $take: Int) {
    generativeTokens(skip: $skip, take: $take) {
      id
      name
      slug
      metadata
      supply
      balance
      enabled
      royalties
      createdAt
      marketStats {
        floor
        listed
      }
      ...Author
      ...Pricing
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
      author {
        id
        name
        flag
        avatarUri
      }
      marketStats {
        floor
        listed
      }
    }
  }
`

interface Props {
}

export const MarketplaceCollections = ({}: Props) => {
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
        nbHits={10}
      />

      <Spacing size="large" />

      {searchLoading && (
        <LoaderBlock height="140px">searching</LoaderBlock>
      )}

      {searchResults ? (
        searchResults.length > 0 ? (
          <CardListsContainer>
            {searchResults.map(token => (
              <GenerativeTokenCardList
                key={token.id}
                token={token}
                url={getGenerativeTokenMarketplaceUrl(token)}
              />
            ))}
          </CardListsContainer>
        ):(
          <p>Your query did not yield any results. 😟</p>
        )
      ):(
        generativeTokens?.length > 0 && (
          <InfiniteScrollTrigger onTrigger={infiniteScrollFetch}>
            <CardListsContainer>
              {generativeTokens.map(token => (
                <GenerativeTokenCardList
                  key={token.id}
                  token={token}
                  url={getGenerativeTokenMarketplaceUrl(token)}
                />
              ))}
            </CardListsContainer>
          </InfiniteScrollTrigger>
        )
      )}

      {loading && <LoaderBlock height="30vh">loading</LoaderBlock>}
    </>
  )
}
