import { gql, useLazyQuery, useQuery } from '@apollo/client'
import layout from '../styles/Layout.module.scss'
import { GenerativeToken } from '../types/entities/GenerativeToken'
import { CardsContainer } from '../components/Card/CardsContainer'
import { GenerativeTokenCard } from '../components/Card/GenerativeTokenCard'
import { LoaderBlock } from '../components/Layout/LoaderBlock'
import { InfiniteScrollTrigger } from '../components/Utils/InfiniteScrollTrigger'
import { SearchInput } from '../components/Input/SearchInput'
import { useState, useRef, useEffect } from 'react'
import cs from "classnames"
import { Spacing } from '../components/Layout/Spacing'
import { SearchTerm } from '../components/Utils/SearchTerm'


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

const Qu_searchTokens = gql`
  query Query($search: String!) {
    searchGenerativeTokens(search: $search) {
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
  const [searchString, setSearchString] = useState<string>("")
  const [searchStringActive, setSearchStringActive] = useState<string|null>(null)

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

  const [ querySearch, { data: dataSearch, loading: loadingSearch }] = useLazyQuery(Qu_searchTokens, {
    fetchPolicy: "no-cache"
  })

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

  const triggerSearch = (str: string) => {
    if (str.length > 0) {
      querySearch({
        variables: {
          search: str
        }
      })
      setSearchStringActive(str)
    }
    else {
      setSearchStringActive(null)
    }
  }

  const generativeTokens: GenerativeToken[] = searchStringActive 
    ? dataSearch?.searchGenerativeTokens
    : data?.generativeTokens

  const isLoading = searchStringActive ? loadingSearch : loading

  return (
    <>
      <div className={cs(layout['search-container'])}>
        <SearchInput 
          value={searchString}
          onChange={setSearchString}
          placeholder="search by artist name, tags, title..."
          onSearch={triggerSearch}
          className={cs(layout['search-bar'])}
        />
        {searchStringActive && (
          <SearchTerm term={searchStringActive} onClear={() => setSearchStringActive(null)} />
        )}
      </div>

      <Spacing size="large" />

      {searchStringActive ? (
        generativeTokens.length > 0 ? (
          <CardsContainer>
            {generativeTokens.map(token => (
              <GenerativeTokenCard key={token.id} token={token}/>
            ))}
          </CardsContainer>
        ):(
          <p>Your query did not yield any results.<br/> We are working on improving our search engine, sorry if you expected to find something 😟</p>
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

      {isLoading && <LoaderBlock height="30vh">loading</LoaderBlock>}
    </>
  )
}
