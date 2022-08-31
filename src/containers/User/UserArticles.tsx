import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { User } from "../../types/entities/User";
import { useQuery } from "@apollo/client";
import style from "./UserArticles.module.scss";
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger";
import { CardNftArticle } from "../../components/Card/CardNFTArticle";
import { CardNftArticleSkeleton } from "../../components/Card/CardNFTArticleSkeleton";
import { Qu_userArticles } from "../../queries/user";
import cs from "classnames";
import layout from "../../styles/Layout.module.scss";
import { LocalArticles } from "../Article/LocalArticles";

interface UserArticlesProps {
  user: User
  showLocalDrafts?: boolean
}

const ITEMS_PER_PAGE = 20
const _UserArticles = ({ user, showLocalDrafts }: UserArticlesProps) => {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false);

  const { data, loading, fetchMore } = useQuery<{ user: User }>(Qu_userArticles, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort: {
        createdAt: "DESC"
      },
      filters: {
        flag_ne: "HIDDEN",
      }
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
  })
  const articles = useMemo(() => data?.user?.articles || [], [data?.user?.articles])
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false;
    const { data } = await fetchMore({
      variables: {
        skip: articles.length,
        take: ITEMS_PER_PAGE
      },
    });
    if (!(data?.user?.articles?.length > 0)) {
      setHasNothingToFetch(true);
    }
  }, [loading, hasNothingToFetch, fetchMore, articles.length])
  return (
    <div className={cs(style.container, layout['padding-big'])}>
      <InfiniteScrollTrigger
        onTrigger={handleFetchMore}
        canTrigger={!!data && !loading}
      >
        {showLocalDrafts && (
          <LocalArticles
            classNameArticle={style.article}
            user={user}
          />
        )}
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
  );
};

export const UserArticles = memo(_UserArticles);
