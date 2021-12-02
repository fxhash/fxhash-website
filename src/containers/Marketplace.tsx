import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { CardsContainer } from '../components/Card/CardsContainer'
import { ObjktCard } from '../components/Card/ObjktCard'
import { LoaderBlock } from '../components/Layout/LoaderBlock'
import { InfiniteScrollTrigger } from '../components/Utils/InfiniteScrollTrigger'
import { useState, useEffect, useMemo, useRef } from 'react'
import { Spacing } from '../components/Layout/Spacing'
import { Offer } from '../types/entities/Offer'
import { AlgoliaSearch } from '../components/Search/AlgoliaSearch'
import { searchIndexMarketplace } from '../services/Algolia'
import { IOptions, Select } from '../components/Input/Select'
import { CardsLoading } from '../components/Card/CardsLoading'


const ITEMS_PER_PAGE = 10

const Qu_offers = gql`
  query Query ($skip: Int, $take: Int, $price: String, $createdAt: String) {
    offers(skip: $skip, take: $take, price: $price, createdAt: $createdAt) {
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
          flag
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
  query Query ($ids: [Float!]!, $createdAt: String, $price: String) {
    offersByIds(ids: $ids, createdAt: $createdAt, price: $price) {
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
          flag
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

const sortOptions: IOptions[] = [
  {
    label: "recently listed",
    value: "createdAt-desc"
  },
  // {
  //   label: "recently created",
  //   value: ""
  // }
  {
    label: "price (high to low)",
    value: "price-desc",
  },
  {
    label: "price (low to high)",
    value: "price-asc",
  },
  {
    label: "oldest listed",
    value: "createdAt-asc",
  },
]

function sortValueToSortVariable(val: string) {
  if (val === "pertinence") return {}
  const split = val.split("-")
  return {
    [split[0]]: split[1].toUpperCase()
  }
}

interface Props {
}

export const Marketplace = ({}: Props) => {
  const [searchResults, setSearchResults] = useState<Offer[]|null>(null)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  const [sortValue, setSortValue] = useState<string>("createdAt-desc")
  const sortVariables = useMemo<Record<string, any>>(() => sortValueToSortVariable(sortValue), [sortValue])

  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore, refetch } = useQuery(Qu_offers, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
      ...sortVariables
    }
  })

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === data.offers?.length) {
        ended.current = true
      }
      else {
        currentLength.current = data.offers?.length
      }
    }
  }, [data, loading])

  const infiniteScrollFetch = () => {
    !ended.current && fetchMore?.({
      variables: {
        skip: data.offers.length,
        take: ITEMS_PER_PAGE,
      },
    })
  }

  const offers: Offer[] = data?.offers

  useEffect(() => {
    refetch?.({
      skip: 0,
      take: ITEMS_PER_PAGE,
      ...sortVariables
    })
  }, [sortVariables])

  return (
    <>
      <AlgoliaSearch
        searchIndex={searchIndexMarketplace}
        gqlMapQuery={Qu_offersByIds}
        onResults={setSearchResults}
        onLoading={setSearchLoading}
        variables={sortVariables}
      >
        <Select
          value={sortValue}
          options={sortOptions}
          onChange={setSortValue}
        />
      </AlgoliaSearch>

      <Spacing size="large" />

      {searchLoading && (
        <LoaderBlock height="100px">searching</LoaderBlock>
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
        <InfiniteScrollTrigger onTrigger={infiniteScrollFetch} canTrigger={!!data && !loading}>
          <CardsContainer>
            <>
              {offers?.length > 0 && offers.map(offer => (
                <ObjktCard key={offer.objkt.id} objkt={offer.objkt}/>
              ))}
              {loading && (
                <CardsLoading number={ITEMS_PER_PAGE} />
              )}
            </>
          </CardsContainer>
        </InfiniteScrollTrigger>
      )}

    </>
  )
}
