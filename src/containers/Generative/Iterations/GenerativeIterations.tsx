import style from "./GenerativeIterations.module.scss"
import layout from "../../../styles/Layout.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { useQuery } from "@apollo/client"
import { Qu_genTokenIterations } from "../../../queries/generative-token"
import { CardsContainer } from "../../../components/Card/CardsContainer"
import { IObjktFeatureFilter, Objkt } from "../../../types/entities/Objkt"
import { CardsLoading } from "../../../components/Card/CardsLoading"
import { ObjktCard } from "../../../components/Card/ObjktCard"
import { useEffect, useMemo, useRef, useState } from "react"
import { SearchHeader } from "../../../components/Search/SearchHeader"
import { IOptions, Select } from "../../../components/Input/Select"
import { InfiniteScrollTrigger } from "../../../components/Utils/InfiniteScrollTrigger"
import { CardsExplorer } from "../../../components/Exploration/CardsExplorer"
import { FiltersPanel } from "../../../components/Exploration/FiltersPanel"
import { GenerativeIterationsFilters } from "./GenerativeIterationsFilters"
import { ExploreTagDef, ExploreTags } from "../../../components/Exploration/ExploreTags"
import { Spacing } from "../../../components/Layout/Spacing"


const ITEMS_PER_PAGE = 20

const sortOptions: IOptions[] = [
  {
    label: "# (low to high)",
    value: "iteration-asc"
  },
  {
    label: "# (high to low)",
    value: "iteration-desc",
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

function sortValueToSortVariable(val: string) {
  if (val === "pertinence") return {}
  const split = val.split("-")
  return {
    [split[0]]: split[1].toUpperCase()
  }
}

interface Props {
  token: GenerativeToken
}
export function GenerativeIterations({
  token,
}: Props) {
  //
  // REFS / STATE
  //
  // reference to the element at the top
  const topMarkerRef = useRef<HTMLDivElement>(null)

  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  // the sort value
  const [sortValue, setSortValue] = useState<string>("iteration-asc")
  const sort = useMemo<Record<string, any>>(() => sortValueToSortVariable(sortValue), [sortValue])

  // the filters on the features, default no filters
  const [featureFilters, setFeatureFilters] = useState<IObjktFeatureFilter[]>([])

  // serialize the feature filters to send to the backend
  const serializedFeatureFilters = useMemo<IObjktFeatureFilter[]>(() => {
    return featureFilters.map(filter => ({
      name: filter.name,
      type: filter.type,
      values: filter.values.map(value => ""+value)
    }))
  }, [featureFilters])

  //
  // QUERIES
  //
  const { data, loading, fetchMore, refetch } = useQuery(Qu_genTokenIterations, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: token.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort,
      featureFilters: serializedFeatureFilters,
    }
  })

  //
  // FAST ACCESS
  //
  const tokens: Objkt[]|null = data?.generativeToken?.objkts

  //
  // UTILITIES
  //
  const infiniteScrollFetch = () => {
    !ended.current && fetchMore?.({
      variables: {
        skip: tokens?.length || 0,
        take: ITEMS_PER_PAGE,
      },
    })
  }

  //
  // SIDE EFFECTS
  //
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
      featureFilters: serializedFeatureFilters,
    })
  }, [sort, serializedFeatureFilters])

  // prevents reloading on scroll if we have reached the end
  useEffect(() => {
    if (!loading) {
      if (currentLength.current === tokens?.length) {
        ended.current = true
      }
      else {
        currentLength.current = tokens?.length || 0
      }
    }
  }, [loading])

  const clearFeatureFilter = (name: string) => {
    setFeatureFilters(featureFilters.filter(filter => filter.name !== name))
  }

  // the visible filter tags
  const filterTags = useMemo<ExploreTagDef[]>(() => {
    return serializedFeatureFilters.map(filter => {
      return {
        value: `${filter.name}: ${filter.values.join(', ')}`,
        onClear: () => clearFeatureFilter(filter.name)
      }
    })
  }, [serializedFeatureFilters])

  return (
    <CardsExplorer>
      {({ 
        filtersVisible,
        setFiltersVisible,
      }) => (
        <>
          <div ref={topMarkerRef}/>

          <SearchHeader
            hasFilters
            onToggleFilters={() => setFiltersVisible(!filtersVisible)}
            sortSelectComp={
              <Select
                value={sortValue}
                options={sortOptions}
                onChange={setSortValue}
              />
            }
          />

          <section className={cs(layout.cards_explorer, layout['padding-big'])}>
            {filtersVisible && (
              <FiltersPanel onClose={() => setFiltersVisible(false)}>
                <GenerativeIterationsFilters
                  token={token}
                  featureFilters={featureFilters}
                  setFeatureFilters={setFeatureFilters}
                />
              </FiltersPanel>
            )}

            <div style={{width: "100%"}}>
              {filterTags.length > 0 && (
                <>
                  <ExploreTags
                    terms={filterTags}
                    onClearAll={() => {
                      setFeatureFilters([])
                    }}
                  />
                  <Spacing size="regular"/>
                </>
              )}

              {!loading && tokens?.length === 0 && (
                <span>No results</span>
              )}

              <InfiniteScrollTrigger onTrigger={infiniteScrollFetch} canTrigger={!!data && !loading}>
                <CardsContainer>
                  {tokens?.map(gentk => (
                    <ObjktCard
                      key={gentk.id}
                      objkt={gentk}
                      showRarity={sort.rarity != null}
                    />
                  ))}

                  {loading && (
                    <CardsLoading number={ITEMS_PER_PAGE} />
                  )}
                </CardsContainer>
              </InfiniteScrollTrigger>
            </div>
          </section>
        </>
      )}
    </CardsExplorer>
  )
}