import React, { memo, useMemo } from 'react';
import style from "./PageArticle.module.scss";
import { NFTArticle } from "../../types/Article";
import { UserBadge } from "../../components/User/UserBadge";
import { format } from "date-fns";
import { ArticleInfos } from "./ArticleInfos";
import Head from "next/head";
import { Spacing } from "../../components/Layout/Spacing";
import { ipfsGatewayUrl } from "../../services/Ipfs";
import cs from "classnames";
import layout from "../../styles/Layout.module.scss";
import text from "../../styles/Text.module.css";

interface PageArticleProps {
  article: NFTArticle
  originUrl: string
}

const _PageArticle = ({ article, originUrl }: PageArticleProps) => {
  const { title, author, createdAt, body, thumbnailUri, language } = article;
  const dateCreatedAt = useMemo(() => new Date(createdAt), [createdAt]);
  const ogImage = useMemo(() => ipfsGatewayUrl(thumbnailUri), [thumbnailUri])
  return (
    <>
      <Head>
        <title>fxhash — {title}</title>
        <meta key="og:title" property="og:title" content={`fxhash - ${title}`} />
        <meta key="description" name="description" content={article.description} />
        <meta key="og:description" property="og:description" content={article.description} />
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content={ogImage} />
      </Head>
      <Spacing size="small" />
      <main className={cs(layout['padding-big'])}>
        <div className={style.header}>
          <UserBadge
            user={author}
            hasLink
            size="big"
          />
          <div className={style.date}>
            <time dateTime={format(dateCreatedAt, 'yyyy/MM/dd')}>
              {format(dateCreatedAt, 'MMMM d, yyyy')}
            </time>
          </div>
          <h1 className={style.title}>{title}</h1>
        </div>
        <article lang={language} className={style.body}>
          <p>{'========== TO REPLACE BY MARKDOWN PARSER ================'}</p>
          {body}
          <p>
            {'========== TO REPLACE BY MARKDOWN PARSER ================'}
          </p>
        </article>
        <div className={style.infos}>
          <ArticleInfos article={article} originUrl={originUrl} />
        </div>
        <div className={style['related-articles']}>
          <h2 className={text.small_title}>Related articles</h2>
          <div className={style['related-articles_list']}>replace by related articles components</div>
        </div>
      </main>
      <Spacing size="6x-large" />
      <Spacing size="6x-large" sm="none" />
    </>
  );
};

export const PageArticle = memo(_PageArticle);
