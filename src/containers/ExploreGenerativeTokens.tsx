import { gql, useQuery } from '@apollo/client'
import { GenerativeToken, GenerativeTokenFilters, GenTokFlag } from '../types/entities/GenerativeToken'
import { CardsContainer } from '../components/Card/CardsContainer'
import { GenerativeTokenCard } from '../components/Card/GenerativeTokenCard'
import { InfiniteScrollTrigger } from '../components/Utils/InfiniteScrollTrigger'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CardsLoading } from '../components/Card/CardsLoading'
import { SettingsContext } from '../context/Theme'
import { ExploreTagDef, ExploreTags } from '../components/Exploration/ExploreTags'
import { GenerativeFilters } from './Generative/GenerativeFilters'
import { Frag_GenAuthor, Frag_GenPricing } from '../queries/fragments/generative-token'
import { getTagsFromFiltersObject } from "../utils/filters";
import useSort from "../hooks/useSort";
import { sortOptionsGenerativeTokens } from "../utils/sort";
import useFilters from "../hooks/useFilters";
import { SortAndFilters } from "../components/SortAndFilters/SortAndFilters";

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

interface Props {
}

export const ExploreGenerativeTokens = ({ }: Props) => {
  const {
    sortValue, setSortValue, sortVariable, restoreSort, setSearchSortOptions, sortOptions
  } = useSort(sortOptionsGenerativeTokens, "mintOpensAt-desc")
  const { filters, setFilters, addFilter, removeFilter } = useFilters<GenerativeTokenFilters>({
    onRemove: (filter) => {
      if (filter === "searchQuery_eq") {
        restoreSort();
      }
    }
  });

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
      sort: sortVariable,
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
      sort: sortVariable,
      filters: filtersWithDefaults,
    })
  }, [sortVariable, filtersWithDefaults, refetch])

  const handleSearch = useCallback((value) => {
    if (value) {
      setSearchSortOptions()
      addFilter("searchQuery_eq", value)
    }
    else {
      removeFilter("searchQuery_eq")
    }
  }, [addFilter, removeFilter, setSearchSortOptions])

  const handleClearTags = useCallback(() => {
    setFilters({});
    restoreSort();
  }, [restoreSort, setFilters])

  // build the list of filters
  const filterTags = useMemo<ExploreTagDef[]>(() =>
    getTagsFromFiltersObject<GenerativeTokenFilters, ExploreTagDef>(filters, ({ label, key }) => ({
      value: label,
      onClear: () => removeFilter(key)
    }))
  , [filters, removeFilter])

  const sort = {
    value: sortValue,
    options: sortOptions,
    onChange: setSortValue,
  }

  return (
    <div ref={topMarkerRef}>
      <SortAndFilters
        sort={sort}
        filterTags={filterTags}
        onClearAllTags={handleClearTags}
        onSearch={handleSearch}
        noResults={!loading && generativeTokens?.length === 0}
        renderFilters={() =>
          <GenerativeFilters
            filters={filters}
            setFilters={setFilters}
          />
        }
      >
        {({ refCardsContainer }) =>
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
                <CardsLoading number={ITEMS_PER_PAGE}/>
              )}
            </CardsContainer>
          </InfiniteScrollTrigger>
        }
      </SortAndFilters>
    </div>
  );
}
