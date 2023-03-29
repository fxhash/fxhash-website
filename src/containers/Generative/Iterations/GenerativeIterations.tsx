import style from "./GenerativeIterations.module.scss"
import layout from "../../../styles/Layout.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { useQuery } from "@apollo/client"
import { Qu_genTokenIterations } from "../../../queries/generative-token"
import { MasonryCardsContainer } from "../../../components/Card/MasonryCardsContainer"
import { CardsContainer } from "../../../components/Card/CardsContainer"
import {
  IObjktFeatureFilter,
  Objkt,
  ObjktFilters,
} from "../../../types/entities/Objkt"
import { CardsLoading } from "../../../components/Card/CardsLoading"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
} from "react"
import { SearchHeader } from "../../../components/Search/SearchHeader"
import { IOptions, Select } from "../../../components/Input/Select"
import { InfiniteScrollTrigger } from "../../../components/Utils/InfiniteScrollTrigger"
import { CardsExplorer } from "../../../components/Exploration/CardsExplorer"
import { FiltersPanel } from "../../../components/Exploration/FiltersPanel"
import { GenerativeIterationsFilters } from "./GenerativeIterationsFilters"
import {
  ExploreTagDef,
  ExploreTags,
} from "../../../components/Exploration/ExploreTags"
import { Spacing } from "../../../components/Layout/Spacing"
import { LargeGentkCard } from "../../../components/Card/LargeGentkCard"
import { CardSizeSelect } from "../../../components/Input/CardSizeSelect"
import { getTagsFromFiltersObject } from "../../../utils/filters"
import { SettingsContext } from "../../../context/Theme"
import useSort from "hooks/useSort"
import { useQueryParamSort } from "hooks/useQueryParamSort"
import { useQueryParam } from "hooks/useQueryParam"

const ITEMS_PER_PAGE = 20

const generativeIterationsSortOptions: IOptions[] = [
  {
    label: "# (low to high)",
    value: "iteration-asc",
  },
  {
    label: "# (high to low)",
    value: "iteration-desc",
  },
  {
    label: "price (low to high)",
    value: "listingPrice-asc",
  },
  {
    label: "price (high to low)",
    value: "listingPrice-desc",
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

interface Props {
  token: GenerativeToken
}
export function GenerativeIterations({ token }: Props) {
  const settings = useContext(SettingsContext)

  //
  // REFS / STATE
  //
  // reference to the element at the top
  const topMarkerRef = useRef<HTMLDivElement>(null)

  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  // the sort value
  const { sortValue, sortVariable, sortOptions, setSortValue } =
    useQueryParamSort(generativeIterationsSortOptions, {
      defaultSort: "iteration-asc",
    })
  // the filters on the features, default no filters
  const [featureFilters, setFeatureFilters] = useQueryParam<
    IObjktFeatureFilter[]
  >("features", [])
  const [objtkFilters, setObjtkFilters] = useState<ObjktFilters>({})

  const removeObjtkFilter = useCallback((key: keyof ObjktFilters) => {
    setObjtkFilters((oldFilters) => {
      const newFilters = { ...oldFilters }
      delete newFilters[key]
      return newFilters
    })
  }, [])

  const clearFeatureFilter = useCallback((name: string) => {
    setFeatureFilters((oldFeaturesFilters: IObjktFeatureFilter[]) =>
      oldFeaturesFilters.filter((filter) => filter.name !== name)
    )
  }, [])

  const handleClearAllTags = useCallback(() => {
    setFeatureFilters([])
    setObjtkFilters({})
  }, [])

  // serialize the feature filters to send to the backend
  const serializedFeatureFilters = useMemo<IObjktFeatureFilter[]>(() => {
    return featureFilters.map((filter: IObjktFeatureFilter) => ({
      name: filter.name,
      type: filter.type,
      values: filter.values.map((value) => "" + value),
    }))
  }, [featureFilters])

  //
  // QUERIES
  //
  const { data, loading, fetchMore, refetch } = useQuery(
    Qu_genTokenIterations,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        id: token.id,
        skip: 0,
        take: ITEMS_PER_PAGE,
        sort: sortVariable,
        featureFilters: serializedFeatureFilters,
        filters: objtkFilters,
      },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-and-network",
    }
  )

  //
  // FAST ACCESS
  //
  const tokens: Objkt[] | null = data?.generativeToken?.objkts

  // the visible filter tags
  const filterTags = useMemo<ExploreTagDef[]>(() => {
    const featuresFiltersTags = serializedFeatureFilters.map((filter) => {
      return {
        value: `${filter.name}: ${filter.values.join(", ")}`,
        onClear: () => clearFeatureFilter(filter.name),
      }
    })
    const objtkFiltersTags = getTagsFromFiltersObject<
      ObjktFilters,
      ExploreTagDef
    >(objtkFilters, ({ key, label }) => ({
      value: label,
      onClear: () => removeObjtkFilter(key),
    }))
    return featuresFiltersTags.concat(objtkFiltersTags)
  }, [
    clearFeatureFilter,
    objtkFilters,
    removeObjtkFilter,
    serializedFeatureFilters,
  ])

  //
  // UTILITIES
  //
  const infiniteScrollFetch = () => {
    !ended.current &&
      fetchMore?.({
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
      sort: sortVariable,
      featureFilters: serializedFeatureFilters,
    })
  }, [sortVariable, serializedFeatureFilters])

  // prevents reloading on scroll if we have reached the end
  useEffect(() => {
    if (!loading) {
      if (currentLength.current === tokens?.length) {
        ended.current = true
      } else {
        currentLength.current = tokens?.length || 0
      }
    }
  }, [loading])

  const CContainer = settings.layoutMasonry
    ? MasonryCardsContainer
    : CardsContainer

  return (
    <CardsExplorer cardSizeScope="generative-iteration">
      {({
        filtersVisible,
        setFiltersVisible,
        inViewCardsContainer,
        refCardsContainer,
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
              <Select
                className={style.select}
                classNameRoot={style.select_root}
                value={sortValue}
                options={sortOptions}
                onChange={setSortValue}
              />
            }
            sizeSelectComp={
              <CardSizeSelect value={cardSize} onChange={setCardSize} />
            }
            padding="small-sm-big"
          />
          <section
            className={cs(
              layout.cards_explorer,
              layout["padding-small-sm-big"]
            )}
          >
            <FiltersPanel
              open={filtersVisible}
              onClose={() => setFiltersVisible(false)}
            >
              <GenerativeIterationsFilters
                token={token}
                featureFilters={featureFilters}
                setFeatureFilters={setFeatureFilters}
                objtkFilters={objtkFilters}
                setObjtkFilters={setObjtkFilters}
              />
            </FiltersPanel>
            <div style={{ width: "100%" }}>
              {filterTags.length > 0 && (
                <>
                  <ExploreTags
                    terms={filterTags}
                    onClearAll={handleClearAllTags}
                  />
                  <Spacing size="regular" />
                </>
              )}

              {!loading && tokens?.length === 0 && <span>No results</span>}

              <InfiniteScrollTrigger
                onTrigger={infiniteScrollFetch}
                canTrigger={!!data && !loading}
              >
                <CContainer ref={refCardsContainer} cardSize={cardSize}>
                  {tokens?.map((gentk) => (
                    <LargeGentkCard
                      key={gentk.id}
                      objkt={gentk}
                      showRarity={sortVariable.rarity != null}
                    />
                  ))}
                  {loading &&
                    CardsLoading({
                      number: ITEMS_PER_PAGE,
                      type: "large",
                    })}
                </CContainer>
              </InfiniteScrollTrigger>
            </div>
          </section>
        </>
      )}
    </CardsExplorer>
  )
}
