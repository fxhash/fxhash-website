import React, { memo, useMemo } from 'react';
import style from "./PageArticle.module.scss";
import { NFTArticle } from "../../types/entities/Article";
import { UserBadge } from "../../components/User/UserBadge";
import { format } from "date-fns";
import { ArticleInfos } from "./ArticleInfos";
import Head from "next/head";
import { Spacing } from "../../components/Layout/Spacing";
import { ipfsGatewayUrl } from "../../services/Ipfs";
import cs from "classnames";
import layout from "../../styles/Layout.module.scss";
import text from "../../styles/Text.module.css";
import { CardSmallNftArticle } from "../../components/Card/CardSmallNFTArticle";
import { NftArticle } from '../../components/NFTArticle/NFTArticle';
import { ButtonsArticlePreview } from "./ButtonsArticlePreview";
import Image from "next/image";

interface PageArticleProps {
  article: NFTArticle
  isPreview?: boolean,
  originUrl: string
}

const _PageArticle = ({ article, originUrl, isPreview }: PageArticleProps) => {
  const { title, description, author, createdAt, body, thumbnailUri, language, relatedArticles } = article;
  const dateCreatedAt = useMemo(() => new Date(createdAt), [createdAt]);
  const thumbnailUrl = useMemo(() => ipfsGatewayUrl(thumbnailUri), [thumbnailUri])

  return (
    <>
      <Head>
        <title>fxhash — {isPreview ? '[Preview] - ' : ''}{title}</title>
        <meta key="og:title" property="og:title" content={`fxhash - ${title}`} />
        <meta key="description" name="description" content={article.description} />
        <meta key="og:description" property="og:description" content={article.description} />
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content={thumbnailUrl} />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/highlight/dracula.css"/>
      </Head>
      <Spacing size="small" />
      <main className={cs(layout['padding-big'])}>
        <div className={style.header}>
          {author &&
            <UserBadge
              user={author}
              hasLink
              size="big"
            />
          }
          <div className={style.date}>
            <time dateTime={format(dateCreatedAt, 'yyyy/MM/dd')}>
              {format(dateCreatedAt, 'MMMM d, yyyy')}
            </time>
          </div>
          <h1 className={style.title}>{title}</h1>
          <p className={style.description}>{description}</p>
          <div className={style.thumbnail}>
            <Image
              src={thumbnailUrl}
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>
        <article lang={language} className={style.body}>
          <NftArticle
            markdown={body}
          />
        </article>
        <div className={style.infos}>
          <ArticleInfos article={article} originUrl={originUrl} />
        </div>
        {relatedArticles?.length > 0 &&
          <div className={style['related-articles']}>
            <h2 className={text.small_title}>Related articles</h2>
            <div className={style['related-articles_list']}>
              {relatedArticles.map((a, index) =>
                <CardSmallNftArticle key={index} article={a}/>
              )}
            </div>
          </div>
        }
        {isPreview &&
          <>
            <Spacing size="6x-large" />
            <ButtonsArticlePreview id={article.id} article={article} />
          </>
        }
      </main>
      <Spacing size="6x-large" />
      <Spacing size="6x-large" sm="none" />
    </>
  );
};

export const PageArticle = memo(_PageArticle);
