import { gql, useQuery } from '@apollo/client'
import { GenerativeToken, GenerativeTokenFilters } from '../../types/entities/GenerativeToken'
import { LoaderBlock } from '../../components/Layout/LoaderBlock'
import { InfiniteScrollTrigger } from '../../components/Utils/InfiniteScrollTrigger'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Spacing } from '../../components/Layout/Spacing'
import { CardListsContainer } from "../../components/Card/CardListsContainer"
import { GenerativeTokenCardList } from "../../components/Card/GenerativeTokenCardList"
import { getGenerativeTokenMarketplaceUrl } from "../../utils/generative-token"
import { Frag_GenAuthor, Frag_GenPricing } from "../../queries/fragments/generative-token"
import { SearchHeader } from "../../components/Search/SearchHeader";
import { IOptions, Select } from "../../components/Input/Select";
import { SearchInputControlled } from "../../components/Input/SearchInputControlled";
import styleSearch from "../../components/Input/SearchInput.module.scss";
import { CardsExplorer } from "../../components/Exploration/CardsExplorer";
import layout from "../../styles/Layout.module.scss";
import cs from "classnames";
import { ExploreTagDef, ExploreTags } from "../../components/Exploration/ExploreTags";
import { ITagsFilters, tagsFilters } from "../../utils/filters";
import { FiltersPanel } from "../../components/Exploration/FiltersPanel";
import { GenerativeFilters } from "../Generative/GenerativeFilters";
import style from './Collections.module.scss';
import { sortOptions, sortOptionsCollections, sortValueToSortVariable } from "../../utils/sort";

const ITEMS_PER_PAGE = 10

const Qu_genTokens = gql`
  ${Frag_GenAuthor}
  ${Frag_GenPricing}

  query Query ($skip: Int, $take: Int, $sort: GenerativeSortInput, $filters: GenerativeTokenFilter) {
    generativeTokens(skip: $skip, take: $take, sort: $sort, filters: $filters) {
      id
      name
      slug
      thumbnailUri
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

const searchSortOptions: IOptions[] = [
  sortOptions['relevance-desc'],
  ...sortOptionsCollections,
]

interface Props {
}

export const MarketplaceCollections = ({}: Props) => {
  const [sortValue, setSortValue] = useState<string>("mintOpensAt-desc")
  const [sortOptions, setSortOptions] = useState<IOptions[]>(sortOptionsCollections)
  const [filters, setFilters] = useState<GenerativeTokenFilters>({})

  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)
  const sortBeforeSearch = useRef<string>(sortValue)

  const sort = useMemo<Record<string, any>>(() => sortValueToSortVariable(
    sortValue
  ), [sortValue])

  const { data, loading, fetchMore } = useQuery(Qu_genTokens, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort,
      filters,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
  })

  const infiniteScrollFetch = useCallback(() => {
    if (!ended.current) {
      fetchMore({
        variables: {
          skip: data.generativeTokens.length,
          take: ITEMS_PER_PAGE
        }
      })
    }
  }, [data, fetchMore])

  const addFilter = useCallback((filter: string, value: any) => {
    setFilters({
      ...filters,
      [filter]: value
    })
  }, [filters])

  const removeFilter = useCallback((filter: string) => {
    addFilter(filter, undefined)
    // if the filter is search string, we reset the sort to what ti was
    if (filter === "searchQuery_eq" && sortValue === "relevance-desc") {
      setSortValue(sortBeforeSearch.current)
      setSortOptions(sortOptionsCollections)
    }
  }, [addFilter, sortValue])

  const handleSearch = useCallback((value) => {
    if (value) {
      setSortOptions(searchSortOptions)
      setSortValue("relevance-desc")
      addFilter("searchQuery_eq", value)
    }
    else {
      removeFilter("searchQuery_eq")
      setSortOptions(sortOptionsCollections)
      if (sortValue === "relevance-desc") {
        setSortValue(sortBeforeSearch.current)
      }
    }
  }, [addFilter, removeFilter, sortValue])

  const filterTags = useMemo<ExploreTagDef[]>(() => {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      const getTag: (value: any) => string = tagsFilters[key as keyof ITagsFilters];
      if (value !== undefined && getTag) {
        acc.push({
          value: getTag(value),
          onClear: () => removeFilter(key)
        })
      }
      return acc;
    }, [] as ExploreTagDef[])
  }, [filters, removeFilter])

  useEffect(() => {
    if (sortValue !== "relevance-desc") {
      sortBeforeSearch.current = sortValue
    }
  }, [sortValue])
  useEffect(() => {
    if (!loading) {
      if (currentLength.current === data?.generativeTokens?.length) {
        ended.current = true
      }
      else {
        currentLength.current = data?.generativeTokens?.length
      }
    }
  }, [data, loading])
  const generativeTokens: GenerativeToken[] = data?.generativeTokens
  return (
    <CardsExplorer>
      {({
        filtersVisible,
        setFiltersVisible,
      }) => (
        <>
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
              onSearch={handleSearch}
              className={styleSearch.large_search}
            />
          </SearchHeader>

          <Spacing size="large" />

          <div className={cs(layout.cards_explorer, layout['padding-big'])}>
            {filtersVisible && (
              <FiltersPanel onClose={() => setFiltersVisible(false)}>
                <GenerativeFilters
                  filters={filters}
                  setFilters={setFilters}
                />
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
              {generativeTokens?.length > 0 && (
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
              }
              {!loading && !(generativeTokens?.length > 0) && <p>Your query did not yield any results. 😟</p>}
              {loading && <LoaderBlock height="30vh">loading</LoaderBlock>}
            </div>
          </div>
        </>
      )}
    </CardsExplorer>
  )
}
