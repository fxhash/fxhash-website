import layout from "../styles/Layout.module.scss"
import styleSearch from "../components/Input/SearchInput.module.scss"
import cs from "classnames"
import { useQuery } from '@apollo/client'
import { CardsContainer } from '../components/Card/CardsContainer'
import { ObjktCard } from '../components/Card/ObjktCard'
import { InfiniteScrollTrigger } from '../components/Utils/InfiniteScrollTrigger'
import { useState, useEffect, useMemo, useRef } from 'react'
import { Spacing } from '../components/Layout/Spacing'
import { Listing, ListingFilters } from '../types/entities/Listing'
import { IOptions, Select } from '../components/Input/Select'
import { CardsLoading } from '../components/Card/CardsLoading'
import { CardsExplorer } from "../components/Exploration/CardsExplorer"
import { SearchHeader } from "../components/Search/SearchHeader"
import { FiltersPanel } from "../components/Exploration/FiltersPanel"
import { MarketplaceFilters } from "./Marketplace/MarketplaceFilters"
import { ExploreTagDef, ExploreTags } from "../components/Exploration/ExploreTags"
import { displayMutez } from "../utils/units"
import { SearchInputControlled } from "../components/Input/SearchInputControlled"
import { Qu_listings } from "../queries/listing"
import { useRouter } from "next/router"
import styleCardsExplorer from "../components/Exploration/CardsExplorer.module.scss";


const ITEMS_PER_PAGE = 40

const generalSortOptions: IOptions[] = [
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

const searchSortOptions: IOptions[] = [
  {
    label: "search relevance",
    value: "relevance-desc",
  },
  ...generalSortOptions
]

function sortValueToSortVariable(val: string) {
  if (val === "pertinence") return {}
  const split = val.split("-")
  return {
    [split[0]]: split[1].toUpperCase()
  }
}

interface Props {
  urlQuery: Record<string, string>
}

// a map of (listing filter) => transformer
// to turn the query parameters into gql-ready variables
type TQueryFilterHandler = {
  param: string,
  transform: (param?: string) => any|undefined,
  encode: (value?: any) => string|undefined
}
const queryListingFilterHandlers: Record<
  keyof ListingFilters, TQueryFilterHandler
> = {
  price_lte: {
    param: "price_lte",
    transform: param => param || undefined,
    encode: value => value ? encodeURIComponent(value) : undefined,
  },
  price_gte: {
    param: "price_gte",
    transform: param => param || undefined,
    encode: value => value ? encodeURIComponent(value) : undefined,
  },
  fullyMinted_eq: {
    param: "fullMint",
    transform: param => param ? param === "1" : undefined,
    encode: value => value !== undefined
      ? encodeURIComponent(value ? "1" : "0")
      : undefined
  },
  authorVerified_eq: {
    param: "verified",
    transform: param => param ? param === "1" : undefined,
    encode: value => value !== undefined
      ? encodeURIComponent(value ? "1" : "0")
      : undefined
  },
  searchQuery_eq: {
    param: "search",
    transform: param => param || undefined,
    encode: value => value || undefined,
  },
  tokenSupply_lte: {
    param: "supply_lte",
    transform: param => param ? parseInt(param) : undefined,
    encode: value => value ? encodeURIComponent(value) : undefined
  },
  tokenSupply_gte: {
    param: "supply_gte",
    transform: param => param ? parseInt(param) : undefined,
    encode: value => value ? encodeURIComponent(value) : undefined
  },
}

/**
 * Given a record of query parameters, outputs some Listing filters
 */
const getFiltersFromUrlQuery = (urlQuery: Record<string, string>) => {
  const loadedFilters: ListingFilters = {}
  // go through each prop of the handler and eventually transform query param
  for (const K in queryListingFilterHandlers) {
    const F = K as keyof ListingFilters
    const handler = queryListingFilterHandlers[F]
    if (urlQuery[handler.param]) {
      loadedFilters[F] = queryListingFilterHandlers[F].transform(
        urlQuery[handler.param]
      )
    }
  }
  return loadedFilters
}

const getSortFromUrlQuery = (urlQuery: Record<string, string>) => {
  const { search, sort } = urlQuery

  // if there is a sort value in the url, pre-select it in the sort input
  // else, select the default value
  let defaultSortValue = search ? 'relevance-desc' : 'createdAt-desc'
  if (sort) {
    let sortValues = search ? searchSortOptions : generalSortOptions
    return sortValues.map(({ value }) => value).includes(sort)
      ? sort
      : defaultSortValue
  }

  return defaultSortValue
}

export const Marketplace = ({ urlQuery }: Props) => {

  // sort variables
  const [sortValue, setSortValue] = useState<string>(
    getSortFromUrlQuery(urlQuery)
  )
  const sort = useMemo<Record<string, any>>(
    () => sortValueToSortVariable(sortValue),
    [sortValue]
  )
  // sort options - when the search is triggered, options are updated
  // to include relevance
  const [sortOptions, setSortOptions] = useState<IOptions[]>(
    urlQuery.search ? searchSortOptions : generalSortOptions
  )
  // keeps track of the search option used before the search was triggered
  const sortBeforeSearch = useRef<string>(sortValue)

  // effect to update the sortBeforeSearch value whenever a sort changes
  useEffect(() => {
    if (sortValue !== "relevance-desc") {
      sortBeforeSearch.current = sortValue
    }
  }, [sortValue])

  // filters
  const [filters, setFilters] = useState<ListingFilters>(
    getFiltersFromUrlQuery(urlQuery)
  )

  // reference to an element at the top to scroll back
  const topMarkerRef = useRef<HTMLDivElement>(null)

  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore, refetch } = useQuery(Qu_listings, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort,
      filters,
    }
  })

  const router = useRouter()

  // update url parameters on filters changes
  useEffect(() => {
    const query: any = {}

    // go through each prop of the handler and eventually encode query param
    for (const K in queryListingFilterHandlers) {
      const F = K as keyof ListingFilters
      const handler = queryListingFilterHandlers[F]
      const encoded = handler.encode(filters[F])
      if (encoded) {
        query[handler.param] = encoded
      }
    }

    query.sort = encodeURIComponent(sortValue)

    router.push(
      { pathname: router.pathname, query },
      `${router.pathname}?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`,
      { shallow: true }
    )

  }, [filters, sortValue])

  useEffect(() => {
    if (!loading && data) {
      if (currentLength.current === data.listings?.length) {
        ended.current = true
      }
      else {
        currentLength.current = data.listings?.length
      }
    }
  }, [loading, data])

  const infiniteScrollFetch = () => {
    !ended.current && fetchMore?.({
      variables: {
        skip: data.listings.length,
        take: ITEMS_PER_PAGE,
      },
    })
  }

  const listings: Listing[] = data?.listings

  useEffect(() => {
    // first we scroll to the top
    const top = (topMarkerRef.current?.offsetTop || 0) + 30
    if (window.scrollY > top) {
      window.scrollTo(0, top)
    }

    currentLength.current = 0
    ended.current = false
    refetch?.({
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort,
      filters,
    })
  }, [sort, filters])

  const addFilter = (filter: string, value: any) => {
    setFilters({
      ...filters,
      [filter]: value
    })
  }

  const removeFilter = (filter: string) => {
    let updatedFilters = { ...filters }
    delete updatedFilters[filter as keyof ListingFilters]
    setFilters(updatedFilters)
    // if the filter is search string, we reset the sort to what ti was
    if (filter === "searchQuery_eq" && sortValue === "relevance-desc") {
      setSortValue(sortBeforeSearch.current)
      setSortOptions(generalSortOptions)
    }
  }

  // build the list of filters
  const filterTags = useMemo<ExploreTagDef[]>(() => {

    const tags: ExploreTagDef[] = []
    for (const key in filters) {
      let value: string | null = null
      // @ts-ignore
      if (filters[key] !== undefined) {
        switch (key) {
          case "price_gte":
            //@ts-ignore
            value = `price >= ${displayMutez(filters[key])} tez`
            break
          case "price_lte":
            //@ts-ignore
            value = `price <= ${displayMutez(filters[key])} tez`
            break
          case "tokenSupply_gte":
            //@ts-ignore
            value = `editions >= ${filters[key]}`
            break
          case "tokenSupply_lte":
            //@ts-ignore
            value = `editions <= ${filters[key]}`
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

  return (
    <CardsExplorer>
      {({
        filtersVisible,
        setFiltersVisible,
        inViewCardsContainer,
        refCardsContainer,
        setIsSearchMinimized,
        isSearchMinimized,
      }) => (
        <>
          <div ref={topMarkerRef} />
          <SearchHeader
            hasFilters
            showFiltersOnMobile={inViewCardsContainer}
            filtersOpened={filtersVisible}
            onToggleFilters={() => setFiltersVisible(!filtersVisible)}
            sortSelectComp={
              <Select
                classNameRoot={cs({
                  [styleCardsExplorer['hide-sort']]: !isSearchMinimized
                })}
                value={sortValue}
                options={sortOptions}
                onChange={setSortValue}
              />
            }
          >
            <SearchInputControlled
              minimizeOnMobile
              onMinimize={setIsSearchMinimized}
              onSearch={(value) => {
                if (value) {
                  setSortOptions(searchSortOptions)
                  setSortValue("relevance-desc")
                  addFilter("searchQuery_eq", value)
                }
                else {
                  removeFilter("searchQuery_eq")
                  setSortOptions(generalSortOptions)
                  if (sortValue === "relevance-desc") {
                    setSortValue(sortBeforeSearch.current)
                  }
                }
              }}
              initialValue={urlQuery.search}
              className={styleSearch.large_search}
            />
          </SearchHeader>

          <div className={cs(layout.cards_explorer, layout['padding-big'])}>
            {filtersVisible && (
              <FiltersPanel onClose={() => setFiltersVisible(false)}>
                <MarketplaceFilters
                  filters={filters}
                  setFilters={setFilters}
                />
              </FiltersPanel>
            )}

            <div style={{ width: "100%" }}>
              {filterTags.length > 0 && (
                <>
                  <ExploreTags
                    terms={filterTags}
                    onClearAll={() => {
                      setFilters({})
                      setSortOptions(generalSortOptions)
                      setSortValue(sortBeforeSearch.current)
                    }}
                  />
                  <Spacing size="regular" />
                </>
              )}

              {!loading && listings?.length === 0 && (
                <span>No results</span>
              )}

              <InfiniteScrollTrigger
                onTrigger={infiniteScrollFetch}
                canTrigger={!!data && !loading}
              >
                <CardsContainer ref={refCardsContainer}>
                  {listings?.length > 0 && listings.map(offer => (
                    <ObjktCard key={offer.id} objkt={offer.objkt} />
                  ))}
                  {loading && (
                    <CardsLoading number={ITEMS_PER_PAGE} />
                  )}
                </CardsContainer>
              </InfiniteScrollTrigger>
            </div>
          </div>
        </>
      )}
    </CardsExplorer>
  )
}
