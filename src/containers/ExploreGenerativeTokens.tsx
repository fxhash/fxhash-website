import { gql, useQuery } from "@apollo/client"
import {
  GenerativeToken,
  GenerativeTokenFilters,
  GenTokFlag,
} from "../types/entities/GenerativeToken"
import { CardsContainer } from "../components/Card/CardsContainer"
import { GenerativeTokenCard } from "../components/Card/GenerativeTokenCard"
import { InfiniteScrollTrigger } from "../components/Utils/InfiniteScrollTrigger"
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { CardsLoading } from "../components/Card/CardsLoading"
import { SettingsContext } from "../context/Theme"
import { ExploreTagDef } from "../components/Exploration/ExploreTags"
import { GenerativeFilters } from "./Generative/GenerativeFilters"
import { Frag_GenCardInfos } from "../queries/fragments/generative-token"
import { getTagsFromFiltersObject } from "../utils/filters"
import useSort from "../hooks/useSort"
import { sortOptionsGenerativeTokens } from "../utils/sort"
import useFilters from "../hooks/useFilters"
import { SortAndFilters } from "../components/SortAndFilters/SortAndFilters"

const ITEMS_PER_PAGE = 20

const Qu_genTokens = gql`
  ${Frag_GenCardInfos}
  query GenerativeTokens(
    $skip: Int
    $take: Int
    $sort: GenerativeSortInput
    $filters: GenerativeTokenFilter
  ) {
    generativeTokens(skip: $skip, take: $take, sort: $sort, filters: $filters) {
      id
      ...GenTokenCardInfos
    }
  }
`

interface ExploreGenerativeTokensProps {
  initialSearchQuery?: string
  onChangeSearch?: (value: string) => void
}

export const ExploreGenerativeTokens = ({
  initialSearchQuery,
  onChangeSearch,
}: ExploreGenerativeTokensProps) => {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)
  const {
    sortValue,
    setSortValue,
    sortVariable,
    restoreSort,
    setSearchSortOptions,
    sortOptions,
  } = useSort(sortOptionsGenerativeTokens, {
    defaultSort: initialSearchQuery ? "relevance-desc" : "mintOpensAt-desc",
  })
  const { filters, setFilters, addFilter, removeFilter } =
    useFilters<GenerativeTokenFilters>({
      onAdd: (filter, updatedFilters) => {
        if (filter === "searchQuery_eq") {
          setSearchSortOptions()
          onChangeSearch?.(updatedFilters[filter] || "")
        }
      },
      onRemove: (filter) => {
        if (filter === "searchQuery_eq") {
          restoreSort()
          onChangeSearch?.("")
        }
      },
      initialFilters: initialSearchQuery
        ? {
            searchQuery_eq: initialSearchQuery,
          }
        : null,
      defaultFilters: {
        mintOpened_eq: true,
        flag_in: [GenTokFlag.CLEAN, GenTokFlag.NONE],
      },
    })

  // reference to an element at the top to scroll back
  const topMarkerRef = useRef<HTMLDivElement>(null)
  const settingsCtx = useContext(SettingsContext)

  const { data, loading, fetchMore, refetch } = useQuery<{
    generativeTokens: GenerativeToken[]
  }>(Qu_genTokens, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort: sortVariable,
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

  const generativeTokens = data?.generativeTokens
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        skip: generativeTokens?.length || 0,
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

  useEffect(() => {
    // first we scroll to the top
    const top = (topMarkerRef.current?.offsetTop || 0) + 30
    if (window.scrollY > top) {
      window.scrollTo(0, top)
    }
    setHasNothingToFetch(false);
  }, [sortVariable, filters, refetch])

  const handleSearch = useCallback(
    (value) => {
      if (value) {
        addFilter("searchQuery_eq", value)
      } else {
        removeFilter("searchQuery_eq")
      }
    },
    [addFilter, removeFilter]
  )

  const handleClearTags = useCallback(() => {
    setFilters({})
    restoreSort()
    onChangeSearch?.("")
  }, [onChangeSearch, restoreSort, setFilters])

  // build the list of filters
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

  const sort = {
    value: sortValue,
    options: sortOptions,
    onChange: setSortValue,
  }

  return (
    <div ref={topMarkerRef}>
      <SortAndFilters
        initialSearchQuery={initialSearchQuery}
        sort={sort}
        filterTags={filterTags}
        onClearAllTags={handleClearTags}
        onSearch={handleSearch}
        noResults={!loading && generativeTokens?.length === 0}
        renderFilters={() => (
          <GenerativeFilters filters={filters} setFilters={setFilters} />
        )}
      >
        {({ refCardsContainer }) => (
          <InfiniteScrollTrigger
            onTrigger={handleFetchMore}
            canTrigger={!hasNothingToFetch && !loading}
          >
            <CardsContainer ref={refCardsContainer}>
              {generativeTokens &&
                generativeTokens.length > 0 &&
                generativeTokens.map((token) => (
                  <GenerativeTokenCard
                    key={token.id}
                    token={token}
                    displayPrice={settingsCtx.displayPricesCard}
                    displayDetails={settingsCtx.displayInfosGenerativeCard}
                  />
                ))}
              {loading && <CardsLoading number={ITEMS_PER_PAGE} />}
            </CardsContainer>
          </InfiniteScrollTrigger>
        )}
      </SortAndFilters>
    </div>
  )
}
