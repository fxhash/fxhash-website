import React, { memo, useContext, useMemo } from "react"
import style from "./CardSmallNFTArticle.module.scss"
import { NFTArticle } from "../../types/entities/Article"
import { Image } from "../Image"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { SettingsContext } from "../../context/Theme"
import cs from "classnames"
import { UserBadge } from "../User/UserBadge"
import Link from "next/link"
import { getArticleUrl } from "../../utils/entities/articles";

interface CardSmallNftArticleProps {
  article: NFTArticle
  imagePriority?: boolean
  className?: string
}

const _CardSmallNftArticle = ({
  article,
  imagePriority,
  className,
}: CardSmallNftArticleProps) => {
  const settings = useContext(SettingsContext)
  const { title, description, thumbnailUri, thumbnailMedia, author } = article
  return (
    <div
      className={cs(style.container, className, {
        [style.hover_effect]: settings.hoverEffectCard,
      })}
    >
      <div className={style["img-wrapper"]}>
        <Image alt="" ipfsUri={thumbnailUri} image={thumbnailMedia} />
      </div>
      <div className={style.infos}>
        <UserBadge user={author!} size="regular" />
        <Link href={getArticleUrl(article)}>
          <a className={style.title}>
            <h5>{title}</h5>
          </a>
        </Link>
        <p className={style.description}>{description}</p>
      </div>
    </div>
  )
}

export const CardSmallNftArticle = memo(_CardSmallNftArticle)
