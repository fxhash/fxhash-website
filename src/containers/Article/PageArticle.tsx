import "katex/dist/katex.min.css"
import React, { memo, useCallback, useContext, useMemo } from "react"
import style from "./PageArticle.module.scss"
import { NFTArticle } from "../../types/entities/Article"
import { UserBadge } from "../../components/User/UserBadge"
import { format } from "date-fns"
import { ArticleInfos } from "./ArticleInfos"
import Head from "next/head"
import { Spacing } from "../../components/Layout/Spacing"
import cs from "classnames"
import layout from "../../styles/Layout.module.scss"
import text from "../../styles/Text.module.css"
import { CardSmallNftArticle } from "../../components/Card/CardSmallNFTArticle"
import { NftArticleProps } from "../../components/NFTArticle/NFTArticle"
import { ImagePolymorphic } from "../../components/Medias/ImagePolymorphic"
import { UserContext } from "../UserProvider"
import { isUserArticleModerator, isUserOrCollaborator } from "../../utils/user"
import { User } from "../../types/entities/User"
import Link from "next/link"
import { Button } from "../../components/Button"
import { ArticlesContext } from "../../context/Articles"
import dynamic from "next/dynamic"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { UserGuard } from "../../components/Guards/UserGuard"
import { ArticleModeration } from "./Moderation/ArticleModeration"
import { ArticleFlagBanner } from "./Moderation/FlagBanner"
import { checkIsTabKeyActive } from "../../components/Layout/Tabs"
import { ArticleActivity } from "./ArticleActivity"
import { ArticleActions } from "./ArticleActions"
import { TabsContainer } from "../../components/Layout/TabsContainer"
import { useContractOperation } from "../../hooks/useContractOperation"
import { LockArticleOperation } from "../../services/contract-operations/LockArticle"
import { ArticleQuickCollect } from "./Infos/ArticleQuickCollect"
import { getImageApiUrl, OG_IMAGE_SIZE } from "../../components/Image"

const NftArticle = dynamic<NftArticleProps>(
  () =>
    import("../../components/NFTArticle/NFTArticle").then(
      (mod) => mod.NftArticle
    ),
  {
    loading: () => <LoaderBlock />,
  }
)

const TABS = [
  {
    key: "owners",
    name: "owners",
  },
  {
    key: "activity",
    name: "activity",
  },
]

interface PageArticleProps {
  article: NFTArticle
  isPreview?: boolean
  originUrl: string
}
const _PageArticle = ({ article, originUrl, isPreview }: PageArticleProps) => {
  const {
    id,
    title,
    description,
    author,
    createdAt,
    body,
    language,
    relatedArticles,
    metadataLocked,
  } = article
  const dateCreatedAt = useMemo(() => new Date(createdAt), [createdAt])
  const { user } = useContext(UserContext)
  const { isEdited, dispatch } = useContext(ArticlesContext)
  const edited = useMemo(() => isEdited(id as string), [isEdited, id])
  // is it the author or a collaborator ?
  const isAuthor = useMemo(
    () => user && author && isUserOrCollaborator(user as User, author),
    [user, author]
  )
  const {
    success: successLocked,
    call: lockArticle,
    loading: lockLoading,
  } = useContractOperation(LockArticleOperation)

  const isLocked = useMemo(
    () => (isAuthor && (metadataLocked || successLocked)) || false,
    [user, isAuthor, metadataLocked, successLocked]
  )

  const cancelEdition = useCallback(() => {
    if (
      window.confirm(
        "Do you want to remove the unpublished local changes made to this article ?"
      )
    ) {
      dispatch({
        type: "delete",
        payload: {
          id: "" + article.id,
        },
      })
    }
  }, [article.id, dispatch])

  const handleLockMetaData = useCallback(() => {
    lockArticle({ article })
  }, [article.id])

  const ogImageUrl =
    article.thumbnailMedia?.cid &&
    getImageApiUrl(article.thumbnailMedia.cid, OG_IMAGE_SIZE)
  // todo [#392] remove article.metadata?.thumbnailCaption
  const thumbnailCaption =
    article.metadata?.thumbnailCaption || article.thumbnailCaption
  return (
    <>
      <Head>
        <title>
          {isPreview ? "[Preview] - " : ""}
          {title} — fxhash
        </title>
        <meta
          key="og:title"
          property="og:title"
          content={`fxhash - ${title}`}
        />
        <meta
          key="description"
          name="description"
          content={article.description}
        />
        <meta
          key="og:description"
          property="og:description"
          content={article.description}
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:image" property="og:image" content={ogImageUrl} />
        <meta name="twitter:site" content="@fx_hash_" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={article.description} />
        <meta name="twitter:image" content={ogImageUrl} />

        <link href="/highlight/prism-dracula.css" rel="stylesheet" />
        <link rel="stylesheet" href="/highlight/dracula.css" />
      </Head>

      <ArticleFlagBanner article={article} />

      <Spacing size="small" />

      <main className={cs(layout["padding-big"])}>
        <div className={style.header}>
          <div className={cs(style.actions)}>
            <UserGuard
              forceRedirect={false}
              allowed={(user) => isUserArticleModerator(user as User)}
            >
              <ArticleModeration article={article} />
            </UserGuard>

            {isAuthor && !isPreview && (
              <>
                {(!edited || isLocked) && (
                  <Button
                    className={style.lockButton}
                    size="small"
                    color="black"
                    iconComp={
                      <i
                        className={`fa-solid fa-lock${isLocked ? "" : "-open"}`}
                        aria-hidden
                      />
                    }
                    onClick={handleLockMetaData}
                    disabled={isLocked}
                    state={lockLoading ? "loading" : "default"}
                  >
                    {isLocked ? "Metadata locked" : "Lock Metadata"}
                  </Button>
                )}
                {!isLocked && (
                  <>
                    <Link href={`/article/editor/${id}`} passHref>
                      <Button
                        isLink
                        size="small"
                        color={edited ? "secondary" : "black"}
                        disabled={lockLoading}
                        iconComp={
                          <i
                            className="fa-solid fa-pen-to-square"
                            aria-hidden
                          />
                        }
                      >
                        {edited ? "resume edition" : "edit article"}
                      </Button>
                    </Link>
                    {edited && (
                      <Button
                        type="button"
                        size="small"
                        color="primary"
                        disabled={lockLoading}
                        iconComp={
                          <i className="fa-solid fa-circle-xmark" aria-hidden />
                        }
                        onClick={cancelEdition}
                      >
                        cancel edition
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          {author && <UserBadge user={author} hasLink size="big" />}
          <div className={style.date}>
            <time dateTime={format(dateCreatedAt, "yyyy/MM/dd")}>
              {format(dateCreatedAt, "MMMM d, yyyy")}
            </time>
          </div>
          <h1 className={cs(style.title)}>{title}</h1>
          <ArticleQuickCollect article={article}>
            {({ collectAction }) => (
              <div className={cs(style.collect)}>{collectAction}</div>
            )}
          </ArticleQuickCollect>
          <p className={cs(style.description, style.awidth)}>{description}</p>
          <figure className={cs(style.thumbnail)}>
            <ImagePolymorphic uri={article.displayUri} />
            {thumbnailCaption && <figcaption>{thumbnailCaption}</figcaption>}
          </figure>
        </div>
        <article lang={language} className={style.body}>
          <NftArticle markdown={body} />
        </article>
        <div className={style.infos}>
          <ArticleInfos
            article={article}
            originUrl={originUrl}
            isPreview={isPreview}
          />
        </div>
        {relatedArticles?.length > 0 && (
          <div className={style["related-articles"]}>
            <h2 className={text.small_title}>Related articles</h2>
            <div className={style["related-articles_list"]}>
              {relatedArticles.map((a, index) => (
                <CardSmallNftArticle key={index} article={a} />
              ))}
            </div>
          </div>
        )}
      </main>
      {!isPreview && (
        <>
          <Spacing size="6x-large" />
          <TabsContainer
            tabDefinitions={TABS}
            checkIsTabActive={checkIsTabKeyActive}
            tabsLayout="fixed-size"
            tabsClassName={cs(layout["padding-big"])}
          >
            {({ tabIndex }) => (
              <div className={layout["padding-big"]}>
                {tabIndex === 0 ? (
                  <ArticleActions article={article} />
                ) : (
                  <ArticleActivity article={article} />
                )}
              </div>
            )}
          </TabsContainer>
        </>
      )}
      <Spacing size="6x-large" />
    </>
  )
}

export const PageArticle = memo(_PageArticle)
