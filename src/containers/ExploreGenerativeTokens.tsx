import { gql, useQuery } from '@apollo/client'
import cs from "classnames"
import layout from "../styles/Layout.module.scss"
import styleSearch from "../components/Input/SearchInput.module.scss"
import { GenerativeToken, GenerativeTokenFilters, GenTokFlag } from '../types/entities/GenerativeToken'
import { CardsContainer } from '../components/Card/CardsContainer'
import { GenerativeTokenCard } from '../components/Card/GenerativeTokenCard'
import { InfiniteScrollTrigger } from '../components/Utils/InfiniteScrollTrigger'
import { useState, useRef, useEffect, useContext, useMemo } from 'react'
import { Spacing } from '../components/Layout/Spacing'
import { CardsLoading } from '../components/Card/CardsLoading'
import { SettingsContext } from '../context/Theme'
import { IOptions, Select } from '../components/Input/Select'
import { ExploreTagDef, ExploreTags } from '../components/Exploration/ExploreTags'
import { CardsExplorer } from '../components/Exploration/CardsExplorer'
import { FiltersPanel } from '../components/Exploration/FiltersPanel'
import { MarketplaceFilters } from './Marketplace/MarketplaceFilters'
import { SearchHeader } from '../components/Search/SearchHeader'
import { SearchInputControlled } from '../components/Input/SearchInputControlled'
import { displayMutez } from '../utils/units'
import { GenerativeFilters } from './Generative/GenerativeFilters'
import { Frag_GenAuthor, Frag_GenPricing } from '../queries/fragments/generative-token'
import { useInView } from "react-intersection-observer";


const ITEMS_PER_PAGE = 20

const Qu_genTokens = gql`
  ${Frag_GenAuthor}
  ${Frag_GenPricing}
  query GenerativeTokens ($skip: Int, $take: Int, $sort: GenerativeSortInput, $filters: GenerativeTokenFilter) {
    generativeTokens(
      skip: $skip, take: $take, sort: $sort, filters: $filters
    ) {
      id
      name
      slug
      thumbnailUri
      flag
      labels
      ...Pricing
      supply
      originalSupply
      balance
      enabled
      royalties
      createdAt
      reserves {
        amount
      }
      ...Author
    }
  }
`

const generalSortOptions: IOptions[] = [
  {
    label: "recently minted",
    value: "mintOpensAt-desc"
  },
  {
    label: "oldest minted",
    value: "mintOpensAt-asc",
  },
  {
    label: "price (low to high)",
    value: "price-asc",
  },
  {
    label: "price (high to low)",
    value: "price-desc",
  },
  {
    label: "editions (low to high)",
    value: "supply-asc",
  },
  {
    label: "editions (high to low)",
    value: "supply-desc",
  },
  {
    label: "balance (low to high)",
    value: "balance-asc",
  },
  {
    label: "balance (high to low)",
    value: "balance-desc",
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
}

export const ExploreGenerativeTokens = ({ }: Props) => {
  // sort variables
  const [sortValue, setSortValue] = useState<string>("mintOpensAt-desc")
  const sort = useMemo<Record<string, any>>(() => sortValueToSortVariable(
    sortValue
  ), [sortValue])
  // sort options - when the search is triggered, options are updated to include relevance
  const [sortOptions, setSortOptions] = useState<IOptions[]>(generalSortOptions)
  // keeps track of the search option used before the search was triggered
  const sortBeforeSearch = useRef<string>(sortValue)
  const { ref: refCardsContainer, inView: inViewCardsContainer } = useInView({
    rootMargin: '-300px 0px -100px'
  })

  // effect to update the sortBeforeSearch value whenever a sort changes
  useEffect(() => {
    if (sortValue !== "relevance-desc") {
      sortBeforeSearch.current = sortValue
    }
  }, [sortValue])

  // filters
  const [filters, setFilters] = useState<GenerativeTokenFilters>({})

  // we have some default filters on top of that
  const filtersWithDefaults = useMemo<GenerativeTokenFilters>(() => ({
    ...filters,
    mintOpened_eq: true,
    flag_in: [
      GenTokFlag.CLEAN,
      GenTokFlag.NONE,
    ]
  }), [filters])

  // reference to an element at the top to scroll back
  const topMarkerRef = useRef<HTMLDivElement>(null)
  const settingsCtx = useContext(SettingsContext)

  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore, refetch } = useQuery(Qu_genTokens, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort,
      filters: filtersWithDefaults,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
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
      filters: filtersWithDefaults,
    })
  }, [sort, filtersWithDefaults])

  const addFilter = (filter: string, value: any) => {
    setFilters({
      ...filters,
      [filter]: value
    })
  }

  const removeFilter = (filter: string) => {
    addFilter(filter, undefined)
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
      let k: any = key
      // @ts-ignore
      if (filters[k] !== undefined) {
        switch (key) {
          case "price_gte":
            //@ts-ignore
            value = `price >= ${displayMutez(filters[key])} tez`
            break
          case "price_lte":
            //@ts-ignore
            value = `price <= ${displayMutez(filters[key])} tez`
            break
          case "supply_gte":
            //@ts-ignore
            value = `editions >= ${filters[key]}`
            break
          case "supply_lte":
            //@ts-ignore
            value = `editions <= ${filters[key]}`
            break
          case "authorVerified_eq":
            //@ts-ignore
            value = `artist: ${filters[key] ? "verified" : "un-verified"}`
            break
          case "mintProgress_eq":
            //@ts-ignore
            value = `mint progress: ${filters[key]?.toLowerCase()}`
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
            showFiltersOnMobile={inViewCardsContainer}
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
              className={styleSearch.large_search}
            />
          </SearchHeader>

          <div className={cs(layout.cards_explorer, layout['padding-big'])}>
            {filtersVisible && (
              <FiltersPanel onClose={() => setFiltersVisible(false)}>
                <GenerativeFilters
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

              {!loading && generativeTokens?.length === 0 && (
                <span>No results</span>
              )}

              <InfiniteScrollTrigger onTrigger={infiniteScrollFetch} canTrigger={!!data && !loading}>
                <CardsContainer ref={refCardsContainer}>
                  {generativeTokens?.length > 0 && generativeTokens.map(token => (
                    <GenerativeTokenCard
                      key={token.id}
                      token={token}
                      displayPrice={settingsCtx.displayPricesCard}
                      displayDetails={settingsCtx.displayInfosGenerativeCard}
                    />
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
