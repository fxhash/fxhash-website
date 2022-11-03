import style from "./Gentks.module.scss"
import styleCardsExplorer from "../../../components/Exploration/CardsExplorer.module.scss"
import styleSearch from "../../../components/Input/SearchInput.module.scss"
import layout from "../../../styles/Layout.module.scss"
import cs from "classnames"
import { IUserCollectionFilters, User } from "../../../types/entities/User"
import { CardsExplorer } from "../../../components/Exploration/CardsExplorer"
import { SearchHeader } from "../../../components/Search/SearchHeader"
import Link from "next/link"
import { getUserProfileLink } from "../../../utils/user"
import { Button } from "../../../components/Button"
import { IOptions, Select } from "../../../components/Input/Select"
import { SearchInputControlled } from "../../../components/Input/SearchInputControlled"
import { FiltersPanel } from "../../../components/Exploration/FiltersPanel"
import { UserCollectionFilters } from "../UserCollectionFilters"
import { ExploreTagDef, ExploreTags } from "../../../components/Exploration/ExploreTags"
import { Spacing } from "../../../components/Layout/Spacing"
import { InfiniteScrollTrigger } from "../../../components/Utils/InfiniteScrollTrigger"
import { CardsContainer } from "../../../components/Card/CardsContainer"
import { ObjktCard } from "../../../components/Card/ObjktCard"
import { CardsLoading } from "../../../components/Card/CardsLoading"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useQuery } from "@apollo/client"
import { Qu_userObjkts } from "../../../queries/user"
import { Objkt } from "../../../types/entities/Objkt"


const ITEMS_PER_PAGE = 40

const generalSortOptions: IOptions[] = [
  {
    label: "recently minted",
    value: "id-desc"
  },
  {
    label: "oldest minted",
    value: "id-asc"
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
  user: User
}
export function UserCollectionGentks({
  user,
}: Props) {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false);

  // sort variables
  const [sortValue, setSortValue] = useState<string>("id-desc")
  const sort = useMemo<Record<string, any>>(
    () => sortValueToSortVariable(sortValue),
    [sortValue]
  )
  // sort options - when the search is triggered, options are updated to include relevance
  const [sortOptions, setSortOptions] = useState<IOptions[]>(generalSortOptions)
  // keeps track of the search option used before the search was triggered
  const sortBeforeSearch = useRef<string>(sortValue)

  // effect to update the sortBeforeSearch value whenever a sort changes
  useEffect(() => {
    if (sortValue !== "relevance-desc") {
      sortBeforeSearch.current = sortValue
    }
  }, [sortValue])

  // filters
  const [filters, setFilters] = useState<IUserCollectionFilters>({})

  // reference to an element at the top to scroll back
  const topMarkerRef = useRef<HTMLDivElement>(null)

  const { data, loading, fetchMore, refetch } = useQuery<{ user: User }>(Qu_userObjkts, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
      filters,
      sort,
    },
    onCompleted: (newData) => {
      if (!newData?.user?.objkts?.length || newData.user.objkts.length < ITEMS_PER_PAGE) {
        setHasNothingToFetch(true);
      }
    }
  })

  // safe access to gentks
  const objkts = data?.user?.objkts || null

  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false;
    const { data: newData } = await fetchMore({
      variables: {
        skip: objkts?.length || 0,
        take: ITEMS_PER_PAGE,
      },
    });
    if (!newData?.user?.objkts?.length || newData.user.objkts.length < ITEMS_PER_PAGE) {
      setHasNothingToFetch(true);
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
      let value: string|null = null
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
        refCardsContainer,
        inViewCardsContainer,
        setIsSearchMinimized,
        isSearchMinimized,
      }) => (
        <>
          <div ref={topMarkerRef}/>

          <SearchHeader
            hasFilters
            filtersOpened={filtersVisible}
            showFiltersOnMobile={inViewCardsContainer}
            onToggleFilters={() => setFiltersVisible(!filtersVisible)}
            sortSelectComp={
		          <div className={style.select_comp_container}>
		            <Link
                  href={`${getUserProfileLink(user)}/collection/enjoy`}
                  passHref
                >
                  <Button
                    isLink={true}
                    iconComp={<i aria-hidden className="fa-sharp fa-solid fa-circle-play"/>}
                    size="regular"
                    iconSide={null}
                  />
		            </Link>
                <Select
                  classNameRoot={cs({
                    [styleCardsExplorer['hide-sort']]: !isSearchMinimized
                  })}
                  value={sortValue}
                  options={sortOptions}
                  onChange={setSortValue}
                />
              </div>
            }
          >
            <SearchInputControlled
              minimizeOnMobile
              onMinimize={setIsSearchMinimized}
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
		          <FiltersPanel
                onClose={() => setFiltersVisible(false)}
              >
		            <UserCollectionFilters
                  user={user}
                  filters={filters}
                  setFilters={setFilters}
		            />
		          </FiltersPanel>
		        )}

		        <div style={{width: "100%"}}>
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
                  <Spacing size="regular"/>
                </>
              )}

              {!loading && objkts?.length === 0 && (
                <span>No results</span>
              )}

              <InfiniteScrollTrigger
                onTrigger={handleFetchMore}
                canTrigger={!loading && !hasNothingToFetch}
              >
                <CardsContainer ref={refCardsContainer}>
                  {objkts?.map(objkt => (
                    <ObjktCard
                      key={objkt.id}
                      objkt={objkt}
                      showOwner={false}
                      showRarity={sort.rarity != null}
                    />
                  ))}
                  {loading && CardsLoading({
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
