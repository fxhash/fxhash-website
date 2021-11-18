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
import { AlgoliaSearch } from '../components/Search/AlgoliaSearch'
import { searchIndexMarketplace } from '../services/Algolia'


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
        slug
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
        issuer {
          author {
            id
            name
            avatarUri
          }
        }
      }
    }
  }
`

const Qu_offersByIds = gql`
  query Query ($ids: [Float!]!) {
    offersByIds(ids: $ids) {
      price
      id
      id
      objkt {
        id
        name
        slug
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
        issuer {
          author {
            id
            name
            avatarUri
          }
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
        slug
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
  const [searchResults, setSearchResults] = useState<Offer[]|null>(null)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  const { data, loading, fetchMore } = useQuery(Qu_offers, {
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE
    }
  })

  const infiniteScrollFetch = () => {
    fetchMore({
      variables: {
        skip: data.offers.length,
        take: ITEMS_PER_PAGE
      }
    })
  }

  const offers: Offer[] = data?.offers

  return (
    <>
      <AlgoliaSearch
        searchIndex={searchIndexMarketplace}
        gqlMapQuery={Qu_offersByIds}
        onResults={setSearchResults}
        onLoading={setSearchLoading}
      />

      <Spacing size="large" />

      {searchLoading && (
        <LoaderBlock height="80px">searching</LoaderBlock>
      )}

      {searchResults ? (
        searchResults.length > 0 ? (
          <CardsContainer>
            {searchResults.map(offer => (
              <ObjktCard key={offer.objkt.id} objkt={offer.objkt} />
            ))}
          </CardsContainer>
        ):(
          <p>Your query did not yield any results. 😟</p>
        )
      ):(
        loading ? (
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
        )
      )}

    </>
  )
}
