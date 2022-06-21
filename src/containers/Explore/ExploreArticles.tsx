import React, { memo, useCallback, useMemo, useState } from 'react';
import style from "./ExploreArticles.module.scss";
import { useQuery } from "@apollo/client";
import { Qu_articles } from "../../queries/articles";
import { NFTArticle } from "../../types/entities/Article";
import { CardNftArticle } from "../../components/Card/CardNFTArticle";
import { CardNftArticleSkeleton } from "../../components/Card/CardNFTArticleSkeleton";
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger";

const ITEMS_PER_PAGE = 20
const _ExploreArticles = () => {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false);

  const { data, loading, fetchMore } = useQuery<{ articles: NFTArticle[] }>(Qu_articles, {
    notifyOnNetworkStatusChange: true,
    variables: {
      skip: 0,
      take: ITEMS_PER_PAGE,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
  })
  const articles = useMemo(() => data?.articles || [], [data?.articles])
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false;
    const { data } = await fetchMore({
      variables: {
        skip: articles.length,
        take: ITEMS_PER_PAGE
      },
    });
    if (!(data?.articles.length > 0)) {
      setHasNothingToFetch(true);
    }
  }, [loading, hasNothingToFetch, fetchMore, articles.length])
  return (
    <div className={style.container}>
      <InfiniteScrollTrigger
        onTrigger={handleFetchMore}
        canTrigger={!!data && !loading}
      >
        {data?.articles.map((article, index) =>
          <CardNftArticle className={style.article} key={article.slug} article={article} imagePriority={index < 4} />
        )}
        {loading &&
          [...Array(20)].map((_, idx) =>
            <CardNftArticleSkeleton className={style.article} key={idx} />
          )
        }
      </InfiniteScrollTrigger>
    </div>
  );
};

export const ExploreArticles = memo(_ExploreArticles);
