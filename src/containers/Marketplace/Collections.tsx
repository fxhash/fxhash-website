import { useQuery } from "@apollo/client"
import {
  GenerativeToken,
  GenerativeTokenFilters,
} from "../../types/entities/GenerativeToken"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Spacing } from "../../components/Layout/Spacing"
import { CardListsContainer } from "../../components/Card/CardListsContainer"
import { GenerativeTokenCardList } from "../../components/Card/GenerativeTokenCardList"
import { getGenerativeTokenMarketplaceUrl } from "../../utils/generative-token"
import { SearchHeader } from "../../components/Search/SearchHeader"
import { IOptions, Select } from "../../components/Input/Select"
import { SearchInputControlled } from "../../components/Input/SearchInputControlled"
import styleSearch from "../../components/Input/SearchInput.module.scss"
import { CardsExplorer } from "../../components/Exploration/CardsExplorer"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import {
  ExploreTagDef,
  ExploreTags,
} from "../../components/Exploration/ExploreTags"
import { getTagsFromFiltersObject } from "../../utils/filters"
import { FiltersPanel } from "../../components/Exploration/FiltersPanel"
import { GenerativeFilters } from "../Generative/GenerativeFilters"
import style from "./Collections.module.scss"
import {
  sortOptions,
  sortOptionsCollections,
  sortValueToSortVariable,
} from "../../utils/sort"
import styleCardsExplorer from "../../components/Exploration/CardsExplorer.module.scss"
import { Qu_genTokensMarketplaceCollections } from "../../queries/generative-token"

const ITEMS_PER_PAGE = 10

const searchSortOptions: IOptions[] = [
  sortOptions["relevance-desc"],
  ...sortOptionsCollections,
]

interface Props {}

export const MarketplaceCollections = ({}: Props) => {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)
  const [sortValue, setSortValue] = useState<string>("mintOpensAt-desc")
  const [sortOptions, setSortOptions] = useState<IOptions[]>(
    sortOptionsCollections
  )
  const [filters, setFilters] = useState<GenerativeTokenFilters>({})

  const sortBeforeSearch = useRef<string>(sortValue)

  const sort = useMemo<Record<string, any>>(
    () => sortValueToSortVariable(sortValue),
    [sortValue]
  )

  const { data, loading, fetchMore } = useQuery<{
    generativeTokens: GenerativeToken[]
  }>(Qu_genTokensMarketplaceCollections, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort,
      filters,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
    onCompleted: (newData) => {
      if (
        !newData?.generativeTokens?.length ||
        newData.generativeTokens.length < ITEMS_PER_PAGE
      ) {
        setHasNothingToFetch(true)
      }
    },
  })

  const addFilter = useCallback(
    (filter: string, value: any) => {
      setFilters({
        ...filters,
        [filter]: value,
      })
    },
    [filters]
  )

  const removeFilter = useCallback(
    (filter: string) => {
      addFilter(filter, undefined)
      // if the filter is search string, we reset the sort to what ti was
      if (filter === "searchQuery_eq" && sortValue === "relevance-desc") {
        setSortValue(sortBeforeSearch.current)
        setSortOptions(sortOptionsCollections)
      }
    },
    [addFilter, sortValue]
  )

  const handleSearch = useCallback(
    (value) => {
      if (value) {
        setSortOptions(searchSortOptions)
        setSortValue("relevance-desc")
        addFilter("searchQuery_eq", value)
      } else {
        removeFilter("searchQuery_eq")
        setSortOptions(sortOptionsCollections)
        if (sortValue === "relevance-desc") {
          setSortValue(sortBeforeSearch.current)
        }
      }
    },
    [addFilter, removeFilter, sortValue]
  )

  const filterTags = useMemo<ExploreTagDef[]>(
    () =>
      getTagsFromFiltersObject<GenerativeTokenFilters, ExploreTagDef>(
        filters,
        ({ label, key }) => ({
          value: label,
          onClear: () => removeFilter(key),
        })
      ),
    [filters, removeFilter]
  )

  useEffect(() => {
    if (sortValue !== "relevance-desc") {
      sortBeforeSearch.current = sortValue
    }
  }, [sortValue])

  const generativeTokens = data?.generativeTokens

  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        skip: generativeTokens?.length,
        take: ITEMS_PER_PAGE,
      },
    })
    if (
      !newData?.generativeTokens?.length ||
      newData.generativeTokens.length < ITEMS_PER_PAGE
    ) {
      setHasNothingToFetch(true)
    }
  }, [loading, hasNothingToFetch, fetchMore, generativeTokens?.length])
  return (
    <CardsExplorer>
      {({
        filtersVisible,
        setFiltersVisible,
        inViewCardsContainer,
        refCardsContainer,
        isSearchMinimized,
        setIsSearchMinimized,
      }) => (
        <>
          <SearchHeader
            hasFilters
            showFiltersOnMobile={inViewCardsContainer}
            filtersOpened={filtersVisible}
            onToggleFilters={() => setFiltersVisible(!filtersVisible)}
            sortSelectComp={
              <Select
                classNameRoot={cs({
                  [styleCardsExplorer["hide-sort"]]: !isSearchMinimized,
                })}
                value={sortValue}
                options={sortOptions}
                onChange={setSortValue}
              />
            }
          >
            <SearchInputControlled
              minimizeBehavior="mobile"
              onMinimize={setIsSearchMinimized}
              onSearch={handleSearch}
              className={styleSearch.large_search}
            />
          </SearchHeader>

          <Spacing size="large" />

          <div className={cs(layout.cards_explorer, layout["padding-big"])}>
            {filtersVisible && (
              <FiltersPanel onClose={() => setFiltersVisible(false)}>
                <GenerativeFilters filters={filters} setFilters={setFilters} />
              </FiltersPanel>
            )}
            <div className={cs(style.results)}>
              {filterTags.length > 0 && (
                <>
                  <ExploreTags
                    terms={filterTags}
                    onClearAll={() => {
                      setFilters({})
                      setSortOptions(sortOptionsCollections)
                      setSortValue(sortBeforeSearch.current)
                    }}
                  />
                  <Spacing size="regular" />
                </>
              )}
              {generativeTokens && generativeTokens?.length > 0 && (
                <InfiniteScrollTrigger
                  onTrigger={handleFetchMore}
                  canTrigger={!loading && !hasNothingToFetch}
                >
                  <CardListsContainer ref={refCardsContainer}>
                    {generativeTokens.map((token) => (
                      <GenerativeTokenCardList
                        key={token.id}
                        token={token}
                        url={getGenerativeTokenMarketplaceUrl(token)}
                      />
                    ))}
                  </CardListsContainer>
                </InfiniteScrollTrigger>
              )}
              {!loading &&
                !(generativeTokens && generativeTokens?.length > 0) && (
                  <p>Your query did not yield any results. 😟</p>
                )}
              {loading && <LoaderBlock height="30vh">loading</LoaderBlock>}
            </div>
          </div>
        </>
      )}
    </CardsExplorer>
  )
}
