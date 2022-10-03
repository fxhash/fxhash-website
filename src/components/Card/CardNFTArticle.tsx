import React, {
  memo,
  MouseEventHandler,
  useCallback,
  useContext,
  useMemo,
} from "react"
import style from "./CardNFTArticle.module.scss"
import Image from "next/image"
import { NFTArticleInfos } from "../../types/entities/Article"
import { UserBadge } from "../User/UserBadge"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import cs from "classnames"
import { SettingsContext } from "../../context/Theme"
import { format } from "date-fns"
import Link from "next/link"
import { Tags } from "../Tags/Tags"
import { ArticlesContext } from "../../context/Articles"
import { getArticleUrl } from "../../utils/entities/articles"

interface CardNftArticleProps {
  className?: string
  imagePriority?: boolean
  isDraft?: boolean
  article: NFTArticleInfos
  editionsOwned?: number
}

const _CardNftArticle = ({
  article,
  editionsOwned,
  isDraft,
  imagePriority,
  className,
}: CardNftArticleProps) => {
  const {
    id,
    title,
    slug,
    thumbnailUri,
    description,
    tags,
    author,
    createdAt,
    metadataLocked,
  } = article
  const settings = useContext(SettingsContext)
  const thumbnailUrl = useMemo(
    () => thumbnailUri && ipfsGatewayUrl(thumbnailUri),
    [thumbnailUri]
  )
  const dateCreatedAt = useMemo(() => new Date(createdAt), [createdAt])
  const urlArticle = isDraft
    ? `/article/editor/local/${id}`
    : getArticleUrl(article)
  const { isEdited, dispatch } = useContext(ArticlesContext)

  const onClickDeleteLocal = useCallback<
    (confirmMsg: string) => MouseEventHandler
  >(
    (confirmMsg) => (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (window.confirm?.(confirmMsg)) {
        dispatch({
          type: "delete",
          payload: { id: id as string },
        })
      }
    },
    [dispatch, id]
  )

  const edited = useMemo(() => isEdited(id as string), [isEdited, id])

  return (
    <div
      className={cs(style.container, className, {
        [style.hover_effect]: settings.hoverEffectCard,
        [style.draft_container]: isDraft,
      })}
    >
      <Link href={urlArticle}>
        <a className={cs(style.link_wrapper)} />
      </Link>
      {isDraft && (
        <div className={cs(style.banner, style.banner_draft)}>
          <span>DRAFT (saved locally in your browser)</span>
          <button
            type="button"
            onClick={onClickDeleteLocal(
              "Do you really want to delete this article ? It will be removed from your browser memory."
            )}
          >
            <i className="fa-solid fa-trash" aria-hidden />
          </button>
        </div>
      )}
      {!isDraft && edited && (
        <div className={cs(style.banner, style.banner_edition)}>
          <span>
            Unpublished changes
            {metadataLocked && ` but metadata is already locked`}
          </span>
          <div>
            <button
              type="button"
              onClick={onClickDeleteLocal(
                "Do you want to remove the unpublished local changes made to this article ?"
              )}
            >
              <i className="fa-solid fa-trash" aria-hidden />
            </button>
            {!metadataLocked && (
              <Link href={`/article/editor/${article.id}/`} passHref>
                <a>
                  <i className="fa-solid fa-pen-to-square" aria-hidden />
                </a>
              </Link>
            )}
          </div>
        </div>
      )}
      <div className={style.content}>
        {editionsOwned && (
          <span className={cs(style.editions_owned)}>x{editionsOwned}</span>
        )}
        <div
          className={cs(style["img-wrapper"], {
            [style["draft_img-wrapper"]]: isDraft,
          })}
        >
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              priority={imagePriority}
            />
          )}
        </div>
        <div className={style.infos}>
          {!isDraft && (
            <div className={style.infos_header}>
              <UserBadge
                hasLink
                user={author!}
                size="regular"
                className={cs(style.author)}
              />
              <div className={style.date}>
                <time dateTime={format(dateCreatedAt, "yyyy/MM/dd")}>
                  {format(dateCreatedAt, "MMMM d, yyyy")}
                </time>
              </div>
            </div>
          )}
          <Link href={urlArticle}>
            <a className={style.title}>
              <h4>{title}</h4>
            </a>
          </Link>
          <div className={style.description}>
            <p>{description}</p>
          </div>
          <Tags tags={tags} />
        </div>
      </div>
    </div>
  )
}

export const CardNftArticle = memo(_CardNftArticle)
