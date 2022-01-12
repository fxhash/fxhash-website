import layout from "../styles/Layout.module.scss"
import styleSearch from "../components/Input/SearchInput.module.scss"
import cs from "classnames"
import { gql, useQuery } from '@apollo/client'
import { CardsContainer } from '../components/Card/CardsContainer'
import { ObjktCard } from '../components/Card/ObjktCard'
import { InfiniteScrollTrigger } from '../components/Utils/InfiniteScrollTrigger'
import { useState, useEffect, useMemo, useRef } from 'react'
import { Spacing } from '../components/Layout/Spacing'
import { Offer, OfferFilters } from '../types/entities/Offer'
import { IOptions, Select } from '../components/Input/Select'
import { CardsLoading } from '../components/Card/CardsLoading'
import { CardsExplorer } from "../components/Exploration/CardsExplorer"
import { SearchHeader } from "../components/Search/SearchHeader"
import { FiltersPanel } from "../components/Exploration/FiltersPanel"
import { MarketplaceFilters } from "./Marketplace/MarketplaceFilters"
import { ExploreTagDef, ExploreTags } from "../components/Exploration/ExploreTags"
import { displayMutez } from "../utils/units"
import { SearchInputControlled } from "../components/Input/SearchInputControlled"


const ITEMS_PER_PAGE = 10

const Qu_offers = gql`
  query Query ($skip: Int, $take: Int, $price: String, $createdAt: String, $filters: OfferFilter) {
    offers(skip: $skip, take: $take, price: $price, createdAt: $createdAt, filters: $filters) {
      id
      price
      objkt {
        id
        name
        slug
        assigned
        metadata
        duplicate
        offer {
          id
          price
        }
        owner {
          id
          name
          flag
          avatarUri
        }
        issuer {
          flag
          name
          author {
            id
            name
            flag
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
  const [sortValue, setSortValue] = useState<string>("createdAt-desc")
  const sortVariables = useMemo<Record<string, any>>(() => sortValueToSortVariable(sortValue), [sortValue])

  // 
  const [filters, setFilters] = useState<OfferFilters>({})

  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore, refetch } = useQuery(Qu_offers, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
      ...sortVariables,
      filters,
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
  }, [loading])

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
    currentLength.current = 0
    ended.current = false
    refetch?.({
      skip: 0,
      take: ITEMS_PER_PAGE,
      ...sortVariables,
      filters,
    })
  }, [sortVariables, filters])

  const addFilter = (filter: string, value: any) => {
    setFilters({
      ...filters,
      [filter]: value
    })  
  }

  const removeFilter = (filter: string) => {
    addFilter(filter, undefined)
  }

  // build the list of filters
  const filterTags = useMemo<ExploreTagDef[]>(() => {
    const tags: ExploreTagDef[] = []
    for (const key in filters) {
      let value: string|null = null
      // @ts-ignore
      if (filters[key] !== undefined) {
        switch (key) {
          case "price_gte":
            //@ts-ignore
            value = `price > ${displayMutez(filters[key])} tez`
            break
          case "price_lte":
            //@ts-ignore
            value = `price < ${displayMutez(filters[key])} tez`
            break
          case "authorVerified_eq":
            //@ts-ignore
            value = `artist: ${filters[key] ? "verified" : "un-verified"}`
            break
          case "fullyMinted_eq":
            //@ts-ignore
            value = `mint: ${filters[key] ? "completed" : "on-going"}`
            break
          case "searchQuery_eq":
            //@ts-ignore
            value = `search: ${filters[key]}`
            break
        }
        if (value) {
          tags.push({
            value,
            onClear: () => removeFilter(key)
          })
        }
      }
    }
    return tags
  }, [filters])

  console.log(offers)

  return (
    <CardsExplorer>
      {({ 
        filtersVisible,
        setFiltersVisible,
      }) => (
        <>
          <SearchHeader
            hasFilters
            onToggleFilters={() => setFiltersVisible(!filtersVisible)}
            sortSelectComp={
              <Select
                value={sortValue}
                options={sortOptions}
                onChange={setSortValue}
              />
            }
          >
            <SearchInputControlled
              onSearch={(value) => value ? addFilter("searchQuery_eq", value) : removeFilter("searchQuery_eq")}
              className={styleSearch.large_search}
            />
          </SearchHeader>

          <div className={cs(layout.cards_explorer)}>
            {filtersVisible && (
              <FiltersPanel onClose={() => setFiltersVisible(false)}>
                <MarketplaceFilters
                  filters={filters}
                  setFilters={setFilters}
                />
              </FiltersPanel>
            )}

            <div style={{width: "100%"}}>
              {filterTags.length > 0 && (
                <>
                  <ExploreTags
                    terms={filterTags}
                    onClearAll={() => setFilters({})}
                  />
                  <Spacing size="regular"/>
                </>
              )}

              {!loading && offers.length === 0 && (
                <span>No results</span>
              )}

              {offers && offers.map(offer => (
                <div key={offer.id}>
                  {offer.id} / {offer.objkt.name} / {offer.price}
                </div>
              ))}

              <InfiniteScrollTrigger onTrigger={infiniteScrollFetch} canTrigger={!!data && !loading}>
                <CardsContainer>
                  <>
                    {offers?.length > 0 && offers.map(offer => (
                      <ObjktCard key={offer.id} objkt={offer.objkt}/>
                    ))}
                    {loading && (
                      <CardsLoading number={ITEMS_PER_PAGE} />
                    )}
                  </>
                </CardsContainer>
              </InfiniteScrollTrigger>
            </div>
          </div>
        </>
      )}
    </CardsExplorer>
  )
}
