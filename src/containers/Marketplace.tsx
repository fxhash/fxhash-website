import layout from "../styles/Layout.module.scss"
import styleSearch from "../components/Input/SearchInput.module.scss"
import cs from "classnames"
import { gql, useQuery } from '@apollo/client'
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

const getFiltersFromUrlQuery = (urlQuery: Record<string, string>) => {
  const {
    search,
    price_gte,
    price_lte,
    fullMint,
    verified,
    supply_lte,
    supply_gte
  } = urlQuery

  // check all filters except for the search parameter
  let p_lte = price_lte ? parseFloat(price_lte) : undefined
  let p_gte = price_gte ? parseFloat(price_gte) : undefined
  let ts_lte = supply_lte ? parseInt(supply_lte) : undefined
  let ts_gte = supply_gte ? parseInt(supply_gte) : undefined
  let loadedFilters: ListingFilters = {}
  if (p_lte && p_lte !== NaN) loadedFilters.price_lte = p_lte.toString()
  if (p_gte && p_gte !== NaN) loadedFilters.price_gte = p_gte.toString()
  if (fullMint) loadedFilters.fullyMinted_eq = fullMint === "1"
  if (verified) loadedFilters.authorVerified_eq = verified === "1"
  if (ts_lte && ts_lte !== NaN) loadedFilters.tokenSupply_lte = ts_lte
  if (ts_gte && ts_gte !== NaN) loadedFilters.tokenSupply_gte = ts_gte

  // if there is a search query, add the searchQuery_eq filter and load the correct sort options
  if (search) loadedFilters.searchQuery_eq = search

  // set all loaded filters
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
  const [sortValue, setSortValue] = useState<string>(getSortFromUrlQuery(urlQuery))
  const sort = useMemo<Record<string, any>>(
    () => sortValueToSortVariable(sortValue),
    [sortValue]
  )
  // sort options - when the search is triggered, options are updated to include relevance
  const [sortOptions, setSortOptions] = useState<IOptions[]>(urlQuery.search ? searchSortOptions : generalSortOptions)
  // keeps track of the search option used before the search was triggered
  const sortBeforeSearch = useRef<string>(sortValue)

  // effect to update the sortBeforeSearch value whenever a sort changes
  useEffect(() => {
    if (sortValue !== "relevance-desc") {
      sortBeforeSearch.current = sortValue
    }
  }, [sortValue])

  // filters
  const [filters, setFilters] = useState<ListingFilters>(getFiltersFromUrlQuery(urlQuery))

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

    const {
      price_gte,
      price_lte,
      fullyMinted_eq,
      authorVerified_eq,
      searchQuery_eq,
      tokenSupply_lte,
      tokenSupply_gte
    } = filters

    let query: any = {}

    if (price_gte && price_gte !== 'NaN') query.price_gte = encodeURIComponent(price_gte)
    if (price_lte && price_lte !== 'NaN') query.price_lte = encodeURIComponent(price_lte)
    if (fullyMinted_eq !== undefined) query.fullMint = encodeURIComponent(fullyMinted_eq ? '1' : '0')
    if (authorVerified_eq !== undefined) query.verified = encodeURIComponent(authorVerified_eq ? '1' : '0')
    if (searchQuery_eq) query.search = encodeURIComponent(searchQuery_eq)
    if (tokenSupply_lte && tokenSupply_lte !== NaN) query.supply_lte = encodeURIComponent(tokenSupply_lte)
    if (tokenSupply_gte && tokenSupply_gte !== NaN) query.supply_gte = encodeURIComponent(tokenSupply_gte)

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
        console.log("end current")
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
      }) => (
        <>
          <div ref={topMarkerRef} />
          <SearchHeader
            hasFilters
            filtersOpened={filtersVisible}
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

              <InfiniteScrollTrigger onTrigger={infiniteScrollFetch} canTrigger={!!data && !loading}>
                <CardsContainer>
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
