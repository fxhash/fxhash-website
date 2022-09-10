import React, { memo } from 'react';
import { NFTArticle } from "../../types/entities/Article";
import style from "./ArticleActions.module.scss"
import { useQuery } from "@apollo/client";
import { Qu_articleActionsById } from "../../queries/articles";
import { TableArticleListings } from "../../components/Tables/TableArticleListings";

interface ArticleActionsProps {
  article: NFTArticle
}

const _ArticleActions = ({ article }: ArticleActionsProps) => {
  const { data, loading } = useQuery(Qu_articleActionsById, {
    variables: {
      id: article.id
    }
  })
  return (
    <div className={style.container}>
      {data?.article &&
        <div className={style.center}>
          <TableArticleListings
            article={data.article}
            listings={data.article.activeListings}
            ledgers={data.article.ledger}
            loading={loading}
          />
        </div>
      }
    </div>
  );
};

export const ArticleActions = memo(_ArticleActions);
