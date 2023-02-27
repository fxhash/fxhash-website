import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import style from "./ExploreArticles.module.scss"
import { useQuery } from "@apollo/client"
import { Qu_articles } from "../../queries/articles"
import {
  ArticleFlag,
  NFTArticle,
  NFTArticleFilters,
} from "../../types/entities/Article"
import { CardNftArticle } from "../../components/Card/CardNFTArticle"
import { CardNftArticleSkeleton } from "../../components/Card/CardNFTArticleSkeleton"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { sortOptionsArticles } from "../../utils/sort"
import { SortAndFilters } from "../../components/SortAndFilters/SortAndFilters"
import useFilters from "../../hooks/useFilters"
import { ExploreTagDef } from "../../components/Exploration/ExploreTags"
import { getTagsFromFiltersObject } from "../../utils/filters"
import { useQueryParamSort } from "hooks/useQueryParamSort"

const ITEMS_PER_PAGE = 20

interface ExploreArticlesProps {
  initialSearchQuery?: string
  onChangeSearch?: (value: string) => void
}
const _ExploreArticles = ({
  initialSearchQuery,
  onChangeSearch,
}: ExploreArticlesProps) => {
  const topMarkerRef = useRef<HTMLDivElement>(null)
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)
  const {
    sortVariable,
    sortValue,
    sortOptions,
    setSortValue,
    setSearchSortOptions,
    restoreSort,
  } = useQueryParamSort(sortOptionsArticles, {
    defaultSort: initialSearchQuery ? "relevance-desc" : "createdAt-desc",
  })
  const { filters, setFilters, addFilter, removeFilter } =
    useFilters<NFTArticleFilters>({
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
        flag_in: [ArticleFlag.CLEAN, ArticleFlag.NONE],
      },
    })

  const handleSearch = useCallback(
    (value) => {
      if (value) {
        setSearchSortOptions()
        addFilter("searchQuery_eq", value)
      } else {
        removeFilter("searchQuery_eq")
      }
      onChangeSearch?.(value || "")
    },
    [addFilter, onChangeSearch, removeFilter, setSearchSortOptions]
  )
  const handleClearTags = useCallback(() => {
    setFilters({})
    restoreSort()
  }, [restoreSort, setFilters])

  const { data, loading, fetchMore } = useQuery<{ articles: NFTArticle[] }>(
    Qu_articles,
    {
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
          !newData?.articles?.length ||
          newData.articles.length < ITEMS_PER_PAGE
        ) {
          setHasNothingToFetch(true)
        }
      },
    }
  )
  const articles = useMemo(() => data?.articles || [], [data?.articles])
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        skip: articles.length,
        take: ITEMS_PER_PAGE,
      },
    })
    if (
      !newData?.articles?.length ||
      newData.articles.length < ITEMS_PER_PAGE
    ) {
      setHasNothingToFetch(true)
    }
  }, [loading, hasNothingToFetch, fetchMore, articles.length])

  const filterTags = useMemo<ExploreTagDef[]>(
    () =>
      getTagsFromFiltersObject<NFTArticleFilters, ExploreTagDef>(
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

  useEffect(() => {
    const top = (topMarkerRef.current?.offsetTop || 0) + 30
    if (window.scrollY > top) {
      window.scrollTo(0, top)
    }
    setHasNothingToFetch(false)
  }, [sortVariable, filters])
  return (
    <div className={style.container} ref={topMarkerRef}>
      <SortAndFilters
        initialSearchQuery={initialSearchQuery}
        sort={sort}
        onSearch={handleSearch}
        noResults={!loading && articles.length === 0}
        filterTags={filterTags}
        onClearAllTags={handleClearTags}
      >
        {({ refCardsContainer }) => (
          <div ref={refCardsContainer}>
            <InfiniteScrollTrigger
              onTrigger={handleFetchMore}
              canTrigger={!hasNothingToFetch && !loading}
            >
              {articles.map((article, index) => (
                <CardNftArticle
                  key={article.id}
                  className={style.article}
                  article={article}
                  imagePriority={index < 4}
                />
              ))}
              {loading &&
                [...Array(20)].map((_, idx) => (
                  <CardNftArticleSkeleton className={style.article} key={idx} />
                ))}
            </InfiniteScrollTrigger>
          </div>
        )}
      </SortAndFilters>
    </div>
  )
}

export const ExploreArticles = memo(_ExploreArticles)
