import { gql, useLazyQuery, useQuery } from '@apollo/client'
import layout from '../styles/Layout.module.scss'
import { CardsContainer } from '../components/Card/CardsContainer'
import { ObjktCard } from '../components/Card/ObjktCard'
import { LoaderBlock } from '../components/Layout/LoaderBlock'
import { InfiniteScrollTrigger } from '../components/Utils/InfiniteScrollTrigger'
import { SearchInput } from '../components/Input/SearchInput'
import { useState } from 'react'
import cs from "classnames"
import { Spacing } from '../components/Layout/Spacing'
import { SearchTerm } from '../components/Utils/SearchTerm'
import { Offer } from '../types/entities/Offer'


const ITEMS_PER_PAGE = 10

const Qu_offers = gql`
  query Query ($skip: Int, $take: Int) {
    offers(skip: $skip, take: $take) {
      price
      id
      id
      objkt {
        id
        name
        metadata
        offer {
          id
          price
          issuer {
            id
            name
            avatarUri
          }
        }
        owner {
          id
          name
          avatarUri
        }
      }
    }
  }
`

const Qu_searchOffers = gql`
  query Query($search: String!) {
    searchOffers(search: $search) {
      price
      id
      id
      objkt {
        id
        name
        metadata
        offer {
          id
          price
          issuer {
            id
            name
            avatarUri
          }
        }
        owner {
          id
          name
          avatarUri
        }
      }
    }
  }
`

interface Props {
}

export const Marketplace = ({}: Props) => {
  const [searchString, setSearchString] = useState<string>("")
  const [searchStringActive, setSearchStringActive] = useState<string|null>(null)

  const { data, loading, fetchMore } = useQuery(Qu_offers, {
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE
    }
  })

  const [ querySearch, { data: dataSearch, loading: loadingSearch }] = useLazyQuery(Qu_searchOffers, {
    fetchPolicy: "no-cache"
  })

  const infiniteScrollFetch = () => {
    fetchMore({
      variables: {
        skip: data.offers.length,
        take: ITEMS_PER_PAGE
      }
    })
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

  const offers: Offer[] = searchStringActive 
    ? dataSearch?.searchOffers
    : data?.offers

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

      {isLoading ? (
        <LoaderBlock height="30vh">loading</LoaderBlock>
      ):(
        (offers?.length > 0) ? (
          <InfiniteScrollTrigger onTrigger={infiniteScrollFetch}>
            <CardsContainer>
              {offers.map(offer => (
                <ObjktCard key={offer.objkt.id} objkt={offer.objkt}/>
              ))}
            </CardsContainer>
          </InfiniteScrollTrigger>
        ):(
          <p>Your query did not yield any results.<br/> We are working on improving our search engine, sorry if you expected to find something 😟</p>
        )
      )}
    </>
  )
}
