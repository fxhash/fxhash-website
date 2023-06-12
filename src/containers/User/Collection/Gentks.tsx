import style from "./Gentks.module.scss"
import styleCardsExplorer from "../../../components/Exploration/CardsExplorer.module.scss"
import styleSearch from "../../../components/Input/SearchInput.module.scss"
import layout from "../../../styles/Layout.module.scss"
import cs from "classnames"
import { IUserCollectionFilters, User } from "../../../types/entities/User"
import { CardsExplorer } from "../../../components/Exploration/CardsExplorer"
import { SearchHeader } from "../../../components/Search/SearchHeader"
import { Select } from "../../../components/Input/Select"
import { SearchInputControlled } from "../../../components/Input/SearchInputControlled"
import { FiltersPanel } from "../../../components/Exploration/FiltersPanel"
import { UserCollectionFilters } from "../UserCollectionFilters"
import {
  ExploreTagDef,
  ExploreTags,
} from "../../../components/Exploration/ExploreTags"
import { Spacing } from "../../../components/Layout/Spacing"
import { InfiniteScrollTrigger } from "../../../components/Utils/InfiniteScrollTrigger"
import { CardsContainer } from "../../../components/Card/CardsContainer"
import { ObjktCard } from "../../../components/Card/ObjktCard"
import { CardsLoading } from "../../../components/Card/CardsLoading"
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useQuery } from "@apollo/client"
import { Qu_userObjkts } from "../../../queries/user"
import { CardSizeSelect } from "../../../components/Input/CardSizeSelect"
import { GentksActions } from "./GentksActions"
import { useQueryParamSort } from "hooks/useQueryParamSort"
import { sortOptionsUserGentk } from "../../../utils/sort"
import useFilters from "../../../hooks/useFilters"
import { ListingFilters } from "../../../types/entities/Listing"
import { getTagsFromFiltersObject } from "../../../utils/filters"
import { DisplayToggle } from "./DisplayToggle"
import { GentksList } from "./GentksList"
import { UserContext } from "../../UserProvider"
const ITEMS_PER_PAGE = 40

interface Props {
  user: User
}
export function UserCollectionGentks({ user }: Props) {
  const { user: userLogged } = useContext(UserContext)
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list")
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)

  const {
    sortVariable,
    sortValue,
    sortOptions,
    setSortValue,
    setSearchSortOptions,
    restoreSort,
  } = useQueryParamSort(sortOptionsUserGentk)

  // filters
  const { filters, setFilters, addFilter, removeFilter } =
    useFilters<IUserCollectionFilters>({
      onAdd: (filter, updatedFilters) => {
        if (filter === "searchQuery_eq") {
          setSearchSortOptions()
        }
      },
      onRemove: (filter, updatedFilters) => {
        if (filter === "searchQuery_eq") {
          restoreSort()
        }
      },
    })

  // reference to an element at the top to scroll back
  const topMarkerRef = useRef<HTMLDivElement>(null)

  const { data, loading, fetchMore } = useQuery<{ user: User }>(Qu_userObjkts, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
      filters,
      sort: sortVariable,
    },
    onCompleted: (newData) => {
      if (
        !newData?.user?.objkts?.length ||
        newData.user.objkts.length < ITEMS_PER_PAGE
      ) {
        setHasNothingToFetch(true)
      }
    },
  })

  // safe access to gentks
  const objkts = data?.user?.objkts || null

  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        skip: objkts?.length || 0,
        take: ITEMS_PER_PAGE,
      },
    })
    if (
      !newData?.user?.objkts?.length ||
      newData.user.objkts.length < ITEMS_PER_PAGE
    ) {
      setHasNothingToFetch(true)
    }
  }, [fetchMore, hasNothingToFetch, loading, objkts?.length])

  useEffect(() => {
    // first we scroll to the top
    const top = (topMarkerRef.current?.offsetTop || 0) + 20
    if (window.scrollY > top + 10) {
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
  }, [restoreSort, setFilters])

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
  const isUserLogged = userLogged?.id === user.id
  return (
    <CardsExplorer cardSizeScope="user-collection">
      {({
        filtersVisible,
        setFiltersVisible,
        refCardsContainer,
        inViewCardsContainer,
        setIsSearchMinimized,
        isSearchMinimized,
        cardSize,
        setCardSize,
      }) => (
        <>
          <div ref={topMarkerRef} />

          <SearchHeader
            hasFilters
            filtersOpened={filtersVisible}
            showFiltersOnMobile={inViewCardsContainer}
            onToggleFilters={() => setFiltersVisible(!filtersVisible)}
            sortSelectComp={
              <div
                className={cs(style.select_comp_container, {
                  [styleCardsExplorer["hide-sort"]]: !isSearchMinimized,
                })}
              >
                <DisplayToggle onChange={setDisplayMode} value={displayMode} />
                <GentksActions user={user} />
                <Select
                  classNameRoot={cs({
                    [styleCardsExplorer["hide-sort"]]: !isSearchMinimized,
                  })}
                  value={sortValue}
                  options={sortOptions}
                  onChange={setSortValue}
                />
              </div>
            }
            sizeSelectComp={
              displayMode === "grid" ? (
                <CardSizeSelect value={cardSize} onChange={setCardSize} />
              ) : null
            }
          >
            <SearchInputControlled
              minimizeBehavior="mobile"
              onMinimize={setIsSearchMinimized}
              onSearch={handleSearch}
              className={styleSearch.large_search}
            />
          </SearchHeader>

          <div className={cs(layout.cards_explorer, layout["padding-big"])}>
            {filtersVisible && (
              <FiltersPanel onClose={() => setFiltersVisible(false)}>
                <UserCollectionFilters
                  user={user}
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
                    onClearAll={handleClearTags}
                  />
                  <Spacing size="regular" />
                </>
              )}

              {!loading && !objkts?.length && displayMode === "grid" && (
                <span>No results</span>
              )}

              <InfiniteScrollTrigger
                onTrigger={handleFetchMore}
                canTrigger={!loading && !hasNothingToFetch}
              >
                {displayMode === "grid" ? (
                  <CardsContainer ref={refCardsContainer}>
                    {objkts?.map((objkt) => (
                      <ObjktCard
                        key={objkt.id}
                        objkt={objkt}
                        showOwner={false}
                        showRarity={sortVariable.rarity != null}
                      />
                    ))}
                    {loading &&
                      CardsLoading({
                        number: ITEMS_PER_PAGE,
                      })}
                  </CardsContainer>
                ) : (
                  <div ref={refCardsContainer}>
                    <GentksList
                      objkts={objkts || []}
                      editable={isUserLogged}
                      loading={loading}
                      hasMoreObjkts={!hasNothingToFetch}
                    />
                  </div>
                )}
              </InfiniteScrollTrigger>
            </div>
          </div>
        </>
      )}
    </CardsExplorer>
  )
}
