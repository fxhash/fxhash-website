import React, {
  memo,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from "react"
import { SearchSample } from "./SearchSample"
import { SearchInputControlled } from "../../components/Input/SearchInputControlled"
import { TabSearchComponentProps } from "./PageSearch"
import layout from "../../styles/Layout.module.scss"
import { SearchHeader } from "../../components/Search/SearchHeader"
import style from "./SearchSummary.module.scss"
import { useQuery } from "@apollo/client"
import { Qu_search } from "../../queries/search"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { User } from "../../types/entities/User"
import {
  GenerativeToken,
  GenTokFlag,
} from "../../types/entities/GenerativeToken"
import { ArticleFlag, NFTArticle } from "../../types/entities/Article"
import { Listing } from "../../types/entities/Listing"
import { samples } from "./Samples"
import { SettingsContext } from "../../context/Theme"
import {
  defaultHasMoreResults,
  HasMoreResultsAction,
  HasMoreResultsState,
  reducerHasMoreResults,
} from "./SearchSummaryReducer"

export interface SearchQuery {
  users: User[]
  generativeTokens: GenerativeToken[]
  articles: NFTArticle[]
  listings: Listing[]
}
export const ITEMS_PER_PAGE = 20
const _SearchSummary = ({
  query,
  onChangeQuery,
  onChangeTab,
}: TabSearchComponentProps) => {
  const topMarkerRef = useRef<HTMLDivElement>(null)
  const [hasMoreResults, dispatchHasMoreResults] = useReducer<
    React.Reducer<HasMoreResultsState, HasMoreResultsAction>
  >(reducerHasMoreResults, defaultHasMoreResults)
  const settingsCtx = useContext(SettingsContext)
  const handleChangeQuery = useCallback(
    (newQuery) => {
      onChangeQuery(newQuery)
      const top = (topMarkerRef.current?.offsetTop || 0) + 30
      if (window.scrollY > top) {
        window.scrollTo(0, top)
      }
      dispatchHasMoreResults({ type: "reset" })
    },
    [onChangeQuery]
  )
  const handleChangeTab = useCallback(
    (newTab) => () => onChangeTab(newTab),
    [onChangeTab]
  )
  const filter = { searchQuery_eq: query }
  const sort = { relevance: "DESC" }
  const variables = {
    usersFilters: filter,
    usersSort: sort,
    usersTake: ITEMS_PER_PAGE,
    usersSkip: 0,
    generativeTokensFilters: {
      ...filter,
      flag_in: [GenTokFlag.CLEAN, GenTokFlag.NONE],
    },
    generativeTokensSort: sort,
    generativeTokensTake: ITEMS_PER_PAGE,
    generativeTokensSkip: 0,
    articlesFilters: {
      ...filter,
      flag_in: [ArticleFlag.CLEAN, ArticleFlag.NONE],
    },
    articlesSort: sort,
    articlesTake: ITEMS_PER_PAGE,
    articlesSkip: 0,
    listingsFilters: filter,
    listingsSort: sort,
    listingsTake: ITEMS_PER_PAGE,
    listingsSkip: 0,
  }
  const { data, loading, fetchMore } = useQuery<SearchQuery>(Qu_search, {
    variables,
    onCompleted: (newData) => {
      const keys = [
        "users",
        "generativeTokens",
        "articles",
        "listings",
      ] as const
      const payload = keys.reduce((acc, newDataKey) => {
        acc[newDataKey] = {
          results: !!(
            newData?.[newDataKey]?.length &&
            newData.users.length >= ITEMS_PER_PAGE
          ),
          loading: false,
        }
        return acc
      }, {} as HasMoreResultsState)

      dispatchHasMoreResults({
        type: "set",
        payload,
      })
    },
  })
  const handleFetchMore = useCallback(
    (dataKey: keyof SearchQuery, data: any[]) => async () => {
      if (loading || !hasMoreResults[dataKey]) return false
      dispatchHasMoreResults({
        type: "setLoading",
        payload: {
          key: dataKey,
          state: true,
        },
      })
      const variables = {
        [`${dataKey}Skip`]: data?.length || 0,
        [`${dataKey}Take`]: ITEMS_PER_PAGE,
      }
      const { data: newData } = await fetchMore({
        variables,
      })
      dispatchHasMoreResults({
        type: "setLoading",
        payload: {
          key: dataKey,
          state: false,
        },
      })
      dispatchHasMoreResults({
        type: "setHasMoreResults",
        payload: {
          key: dataKey,
          state:
            newData?.[dataKey] && newData[dataKey].length >= ITEMS_PER_PAGE,
        },
      })
    },
    [loading, hasMoreResults, fetchMore]
  )

  const encodedQuery = query && encodeURIComponent(query)
  const hasNoResults = useMemo(
    () => !data || !Object.values(data).some((arr: []) => arr.length > 0),
    [data]
  )
  return (
    <>
      <div ref={topMarkerRef} />
      <SearchHeader>
        <SearchInputControlled
          className={style.search}
          initialValue={query}
          onSearch={handleChangeQuery}
        />
      </SearchHeader>
      {loading && !data ? (
        <LoaderBlock />
      ) : (
        <>
          <div className={layout["padding-big"]}>
            {hasNoResults ? (
              <span>No results</span>
            ) : (
              Object.entries(samples).map(([key, sample]) => {
                const hrefWithQuery = `${sample.hrefExploreMore}${
                  encodedQuery ? `?=${encodedQuery}` : ""
                }`
                const dataSample = data?.[sample.dataKey as keyof SearchQuery]
                const sampleHasResults =
                  hasMoreResults[sample.dataKey as keyof SearchQuery]
                return (
                  dataSample &&
                  dataSample.length > 0 && (
                    <SearchSample
                      key={`${key}${encodedQuery}`}
                      className={style.sample}
                      title={sample.title}
                      hrefExploreMore={hrefWithQuery}
                      onClickExploreMore={handleChangeTab(key)}
                      onFetchMore={handleFetchMore(sample.dataKey, dataSample)}
                      hasMoreResults={sampleHasResults.results}
                    >
                      {({ showMoreResults }) =>
                        sample.render(
                          dataSample,
                          showMoreResults,
                          sampleHasResults.loading,
                          settingsCtx
                        )
                      }
                    </SearchSample>
                  )
                )
              })
            )}
          </div>
        </>
      )}
    </>
  )
}

export const SearchSummary = memo(_SearchSummary)
