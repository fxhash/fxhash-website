import style from "./Gentks.module.scss"
import styleCardsExplorer from "../../../components/Exploration/CardsExplorer.module.scss"
import styleSearch from "../../../components/Input/SearchInput.module.scss"
import layout from "../../../styles/Layout.module.scss"
import cs from "classnames"
import { IUserCollectionFilters, User } from "../../../types/entities/User"
import { CardsExplorer } from "../../../components/Exploration/CardsExplorer"
import { SearchHeader } from "../../../components/Search/SearchHeader"
import { IOptions, Select } from "../../../components/Input/Select"
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useQuery } from "@apollo/client"
import { Qu_userObjkts } from "../../../queries/user"
import { CardSizeSelect } from "../../../components/Input/CardSizeSelect"
import { GentksActions } from "./GentksActions"
import { useQueryParamSort } from "hooks/useQueryParamSort"
const ITEMS_PER_PAGE = 40

const generalSortOptions: IOptions[] = [
  {
    label: "recently minted",
    value: "createdAt-desc",
  },
  {
    label: "oldest minted",
    value: "createdAt-asc",
  },
  {
    label: "recently bought",
    value: "collectedAt-desc",
  },
  {
    label: "rarity (rarest first)",
    value: "rarity-asc",
  },
  {
    label: "rarity (rarest last)",
    value: "rarity-desc",
  },
]

const searchSortOptions: IOptions[] = [
  {
    label: "search relevance",
    value: "relevance-desc",
  },
  ...generalSortOptions,
]

function sortValueToSortVariable(val: string) {
  if (val === "pertinence") return {}
  const split = val.split("-")
  return {
    [split[0]]: split[1].toUpperCase(),
  }
}

interface Props {
  user: User
}
export function UserCollectionGentks({ user }: Props) {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)

  const {
    sortVariable,
    sortValue,
    sortOptions,
    setSortValue,
    setSearchSortOptions,
    restoreSort,
  } = useQueryParamSort(generalSortOptions)

  // filters
  const [filters, setFilters] = useState<IUserCollectionFilters>({})

  // reference to an element at the top to scroll back
  const topMarkerRef = useRef<HTMLDivElement>(null)

  const { data, loading, fetchMore, refetch } = useQuery<{ user: User }>(
    Qu_userObjkts,
    {
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
    }
  )

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

    refetch?.({
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort: sortVariable,
      filters,
    })
  }, [sortVariable, filters])

  const addFilter = (filter: string, value: any) => {
    setFilters({
      ...filters,
      [filter]: value,
    })
  }

  const removeFilter = (filter: string) => {
    addFilter(filter, undefined)
    // if the filter is search string, we reset the sort to what ti was
    if (filter === "searchQuery_eq" && sortValue === "relevance-desc") {
      restoreSort()
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
          case "assigned_eq":
            //@ts-ignore
            value = `metadata assigned: ${filters[key] ? "yes" : "no"} tez`
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
          case "author_in":
            //@ts-ignore
            value = `artists: (${filters[key].length})`
            break
          case "issuer_in":
            //@ts-ignore
            value = `generators: (${filters[key].length})`
            break
        }
        if (value) {
          tags.push({
            value,
            onClear: () => removeFilter(key),
          })
        }
      }
    }
    return tags
  }, [filters])

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
              <CardSizeSelect value={cardSize} onChange={setCardSize} />
            }
          >
            <SearchInputControlled
              minimizeBehavior="mobile"
              onMinimize={setIsSearchMinimized}
              onSearch={(value) => {
                if (value) {
                  addFilter("searchQuery_eq", value)
                  setSearchSortOptions()
                } else {
                  removeFilter("searchQuery_eq")
                  restoreSort()
                }
              }}
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
                  <ExploreTags terms={filterTags} onClearAll={restoreSort} />
                  <Spacing size="regular" />
                </>
              )}

              {!loading && !objkts?.length && <span>No results</span>}

              <InfiniteScrollTrigger
                onTrigger={handleFetchMore}
                canTrigger={!loading && !hasNothingToFetch}
              >
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
              </InfiniteScrollTrigger>
            </div>
          </div>
        </>
      )}
    </CardsExplorer>
  )
}
