import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useQuery } from "@apollo/client"
import { User, UserFilters } from "../../types/entities/User"
import { Qu_users } from "../../queries/user"
import { InfiniteScrollTrigger } from "../Utils/InfiniteScrollTrigger"
import { CardsContainer } from "../Card/CardsContainer"
import { CardsLoading } from "../Card/CardsLoading"
import { SortAndFilters } from "../SortAndFilters/SortAndFilters"
import { ExploreTagDef } from "../Exploration/ExploreTags"
import { getTagsFromFiltersObject } from "../../utils/filters"
import { ListingFilters } from "../../types/entities/Listing"
import useSort from "../../hooks/useSort"
import { sortOptionsUsers } from "../../utils/sort"
import useFilters from "../../hooks/useFilters"
import { UserBadge } from "../User/UserBadge"
import style from "./GalleryUsers.module.scss"
import { UserBadgeLoading } from "../User/UserBadgeLoading"

const ITEMS_PER_PAGE = 20
interface GalleryUsersProps {
  initialSearchQuery?: string
  initialFilters?: UserFilters
  initialSort?: string
  onChangeSearch?: (value: string) => void
}

const _GalleryUsers = ({
  initialSearchQuery,
  initialFilters,
  initialSort,
  onChangeSearch,
}: GalleryUsersProps) => {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)
  const {
    sortValue,
    setSortValue,
    sortVariable,
    restoreSort,
    setSearchSortOptions,
    sortOptions,
  } = useSort(sortOptionsUsers, {
    defaultSort: initialSort,
    defaultWithSearchOptions:
      initialFilters && !!initialFilters["searchQuery_eq"],
  })

  const { filters, setFilters, addFilter, removeFilter } =
    useFilters<UserFilters>({
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
      initialFilters,
    })

  // reference to an element at the top to scroll back
  const topMarkerRef = useRef<HTMLDivElement>(null)

  const { data, loading, fetchMore, refetch } = useQuery<{
    users: User[]
  }>(Qu_users, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
      filters,
      sort: sortVariable,
    },
    onCompleted: (newData) => {
      if (!newData?.users?.length || newData.users.length < ITEMS_PER_PAGE) {
        setHasNothingToFetch(true)
      }
    },
  })

  const users = data?.users
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        skip: users?.length || 0,
        take: ITEMS_PER_PAGE,
      },
    })
    if (!newData?.users?.length || newData.users.length < ITEMS_PER_PAGE) {
      setHasNothingToFetch(true)
    }
  }, [loading, hasNothingToFetch, fetchMore, users?.length])

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
        noResults={!loading && users?.length === 0}
      >
        {({ refCardsContainer }) => (
          <InfiniteScrollTrigger
            onTrigger={handleFetchMore}
            canTrigger={!hasNothingToFetch && !loading}
          >
            <CardsContainer
              className={style.gallery_users}
              ref={refCardsContainer}
            >
              {users &&
                users.length > 0 &&
                users.map((user) => (
                  <UserBadge
                    hasLink
                    key={user.id}
                    avatarSide="top"
                    size="xl"
                    user={user}
                  />
                ))}
              {loading && (
                <UserBadgeLoading
                  avatarSide="top"
                  number={ITEMS_PER_PAGE}
                  size="xl"
                />
              )}
            </CardsContainer>
          </InfiniteScrollTrigger>
        )}
      </SortAndFilters>
    </div>
  )
}

export const GalleryUsers = memo(_GalleryUsers)
