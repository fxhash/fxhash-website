import React, { memo, useCallback, useContext, useMemo } from 'react';
import style from "./LocalArticles.module.scss";
import { ArticlesContext } from "../../context/Articles";
import {
  ArticleFlag,
  NFTArticleInfos,
} from "../../types/entities/Article";
import { CardNftArticle } from "../../components/Card/CardNFTArticle";
import { User } from "../../types/entities/User";
import { Button } from "../../components/Button";
import Link from 'next/link';

interface LocalArticlesProps {
  classNameArticle?: string
  user: User,
}
const _LocalArticles = ({ classNameArticle, user }: LocalArticlesProps) => {
  const { state: { articles }, dispatch } = useContext(ArticlesContext)
  const localArticles = useMemo(() => Object
    .entries(articles)
    .reduce((acc, [uid, article]) => {
      if (!article || article.minted) return acc;
      acc.push({
        id: uid,
        slug: uid,
        flag: ArticleFlag.NONE,
        author: user,
        title: article.form.title || '',
        description: article.form.abstract || '',
        tags: article.form.tags || [],
        thumbnailUri: article.form.thumbnailUri || '',
        createdAt: article.lastSavedAt,
      })
      return acc;
    }, [] as NFTArticleInfos[])
    .sort((articleA, articleB) => articleA.createdAt > articleB.createdAt ? -1 : 1), [articles, user])

  return (
    <>
      <div className={style.container_button}>
        <Link href="/article/editor/local/new" passHref>
          <Button
            isLink
            size="small"
            className={style.button_create}
          >
            create article
          </Button>
        </Link>
      </div>
      {localArticles.map(article =>
        <CardNftArticle
          key={article.id}
          className={classNameArticle}
          article={article}
          isDraft
        />
      )}
    </>
  );
};

export const LocalArticles = memo(_LocalArticles);
