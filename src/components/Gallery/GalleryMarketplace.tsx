import { useQuery } from "@apollo/client"
import { CardsContainer } from "../Card/CardsContainer"
import { ObjktCard } from "../Card/ObjktCard"
import { InfiniteScrollTrigger } from "../Utils/InfiniteScrollTrigger"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Listing, ListingFilters } from "../../types/entities/Listing"
import { CardsLoading } from "../Card/CardsLoading"
import { Qu_listings } from "../../queries/listing"
import useFilters from "../../hooks/useFilters"
import useSort from "../../hooks/useSort"
import { sortOptionsMarketplace } from "../../utils/sort"
import { SortAndFilters } from "../SortAndFilters/SortAndFilters"
import { getTagsFromFiltersObject } from "../../utils/filters"
import { ExploreTagDef } from "../Exploration/ExploreTags"
import { MarketplaceFilters } from "../../containers/Marketplace/MarketplaceFilters"

const ITEMS_PER_PAGE = 40

interface Props {
  initialSearchQuery?: string
  initialSort?: string
  initialFilters?: ListingFilters
  onChangeSearch?: (value: string) => void
  onChangeFilters?: (updatedFilters: ListingFilters) => void
  onChangeSort?: (updatedSort: string) => void
}

export const GalleryMarketplace = ({
  initialSearchQuery,
  initialSort,
  initialFilters,
  onChangeSearch,
  onChangeFilters,
  onChangeSort,
}: Props) => {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)
  const {
    sortValue,
    setSortValue,
    sortVariable,
    restoreSort,
    setSearchSortOptions,
    sortOptions,
  } = useSort(sortOptionsMarketplace, {
    defaultSort: initialSort,
    defaultWithSearchOptions:
      initialFilters && !!initialFilters["searchQuery_eq"],
  })

  const { filters, setFilters, addFilter, removeFilter } =
    useFilters<ListingFilters>({
      onAdd: (filter, updatedFilters) => {
        if (filter === "searchQuery_eq") {
          setSearchSortOptions()
          onChangeSearch?.(updatedFilters[filter] || "")
        }
        onChangeFilters?.(updatedFilters)
      },
      onRemove: (filter, updatedFilters) => {
        if (filter === "searchQuery_eq") {
          restoreSort()
          onChangeSearch?.("")
        }
        onChangeFilters?.(updatedFilters)
      },
      initialFilters,
    })

  // reference to an element at the top to scroll back
  const topMarkerRef = useRef<HTMLDivElement>(null)

  const { data, loading, fetchMore } = useQuery<{
    listings: Listing[]
  }>(Qu_listings, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort: sortVariable,
      filters,
    },
    onCompleted: (newData) => {
      if (
        !newData?.listings?.length ||
        newData.listings.length < ITEMS_PER_PAGE
      ) {
        setHasNothingToFetch(true)
      }
    },
  })

  const listings = data?.listings
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        skip: listings?.length || 0,
        take: ITEMS_PER_PAGE,
      },
    })
    if (
      !newData?.listings?.length ||
      newData.listings.length < ITEMS_PER_PAGE
    ) {
      setHasNothingToFetch(true)
    }
  }, [loading, hasNothingToFetch, fetchMore, listings?.length])

  useEffect(() => {
    // first we scroll to the top
    const top = (topMarkerRef.current?.offsetTop || 0) + 30
    if (window.scrollY > top) {
      window.scrollTo(0, top)
    }
    setHasNothingToFetch(false)
  }, [sortVariable, filters])

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
  const handleChangeSort = useCallback(
    (newSort) => {
      setSortValue(newSort)
      onChangeSort?.(newSort)
    },
    [onChangeSort, setSortValue]
  )
  const handleSetFilters = useCallback(
    (newFilters) => {
      setFilters(newFilters)
      onChangeFilters?.(newFilters)
    },
    [onChangeFilters, setFilters]
  )
  const filterTags = useMemo<ExploreTagDef[]>(
    () =>
      getTagsFromFiltersObject<ListingFilters, ExploreTagDef>(
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
    onChange: handleChangeSort,
  }

  return (
    <div ref={topMarkerRef}>
      <SortAndFilters
        initialSearchQuery={initialSearchQuery}
        sort={sort}
        filterTags={filterTags}
        onClearAllTags={handleClearTags}
        onSearch={handleSearch}
        noResults={!loading && listings?.length === 0}
        renderFilters={() => (
          <MarketplaceFilters filters={filters} setFilters={handleSetFilters} />
        )}
      >
        {({ refCardsContainer }) => (
          <InfiniteScrollTrigger
            onTrigger={handleFetchMore}
            canTrigger={!hasNothingToFetch && !loading}
          >
            <CardsContainer ref={refCardsContainer}>
              {listings &&
                listings.length > 0 &&
                listings.map((offer) => (
                  <ObjktCard key={offer.id} objkt={offer.objkt} />
                ))}
              {loading && <CardsLoading number={ITEMS_PER_PAGE} />}
            </CardsContainer>
          </InfiniteScrollTrigger>
        )}
      </SortAndFilters>
    </div>
  )
}
