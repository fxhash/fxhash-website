import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import style from "./ExploreArticles.module.scss";
import { useQuery } from "@apollo/client";
import { Qu_articles } from "../../queries/articles";
import { NFTArticle, NFTArticleFilters } from "../../types/entities/Article";
import { CardNftArticle } from "../../components/Card/CardNFTArticle";
import { CardNftArticleSkeleton } from "../../components/Card/CardNFTArticleSkeleton";
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger";
import { sortOptionsArticles } from "../../utils/sort";
import useSort from "../../hooks/useSort";
import { SortAndFilters } from "../../components/SortAndFilters/SortAndFilters";
import useFilters from "../../hooks/useFilters";
import { ExploreTagDef } from "../../components/Exploration/ExploreTags";
import { getTagsFromFiltersObject } from "../../utils/filters";

const ITEMS_PER_PAGE = 20
const _ExploreArticles = () => {
  const topMarkerRef = useRef<HTMLDivElement>(null)
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false);
  const { sortVariable, sortValue, sortOptions, setSortValue, setSearchSortOptions, restoreSort } = useSort(sortOptionsArticles, 'createdAt-desc')
  const { filters, setFilters, addFilter, removeFilter } = useFilters<NFTArticleFilters>({
    onRemove: (filter) => {
      if (filter === "searchQuery_eq") {
        restoreSort();
      }
    }
  });

  const handleSearch = useCallback((value) => {
    if (value) {
      setSearchSortOptions()
      addFilter("searchQuery_eq", value)
    }
    else {
      removeFilter("searchQuery_eq")
    }
  }, [addFilter, removeFilter, setSearchSortOptions])
  const handleClearTags = useCallback(() => {
    setFilters({});
    restoreSort();
  }, [restoreSort, setFilters])

  const { data, loading, fetchMore } = useQuery<{ articles: NFTArticle[] }>(Qu_articles, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort: sortVariable,
      filters,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
  })
  const articles = useMemo(() => data?.articles || [], [data?.articles])
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false;
    const { data: newData } = await fetchMore({
      variables: {
        skip: articles.length,
        take: ITEMS_PER_PAGE
      },
    });
    if (!(newData?.articles.length > 0)) {
      setHasNothingToFetch(true);
    }
  }, [loading, hasNothingToFetch, fetchMore, articles.length])

  const filterTags = useMemo<ExploreTagDef[]>(() =>
    getTagsFromFiltersObject<NFTArticleFilters, ExploreTagDef>(filters, ({ label, key }) => ({
      value: label,
      onClear: () => removeFilter(key)
    }))
  , [filters, removeFilter])
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
  }, [sortVariable, filters])
  return (
    <div className={style.container} ref={topMarkerRef}>
      <SortAndFilters
        sort={sort}
        onSearch={handleSearch}
        noResults={!loading && articles.length === 0}
        filterTags={filterTags}
        onClearAllTags={handleClearTags}
      >
        {({ refCardsContainer }) =>
          <div ref={refCardsContainer}>
            <InfiniteScrollTrigger
              onTrigger={handleFetchMore}
              canTrigger={!!data && !loading}
            >
              {articles.map((article, index) =>
                <CardNftArticle className={style.article} key={article.slug} article={article} imagePriority={index < 4} />
              )}
              {loading &&
                [...Array(20)].map((_, idx) =>
                  <CardNftArticleSkeleton className={style.article} key={idx} />
                )
              }
            </InfiniteScrollTrigger>
          </div>
        }
      </SortAndFilters>
    </div>
  );
};

export const ExploreArticles = memo(_ExploreArticles);
