import React, { memo, useContext, useMemo } from 'react';
import style from "./CardNFTArticle.module.scss";
import Image from "next/image";
import { NFTArticle } from "../../types/Article";
import { UserBadge } from "../User/UserBadge";
import { ipfsGatewayUrl } from "../../services/Ipfs";
import cs from "classnames";
import { SettingsContext } from "../../context/Theme";
import { format } from "date-fns";
import Link from 'next/link';
import { Tags } from "../Tags/Tags";

interface CardNftArticleProps {
  className: string,
  article: NFTArticle
  imagePriority?: boolean,
}

const _CardNftArticle = ({ article: { title, slug, thumbnailUri, description, tags, author, createdAt }, imagePriority, className }: CardNftArticleProps) => {
  const settings = useContext(SettingsContext)
  const thumbnailUrl = useMemo(() => thumbnailUri && ipfsGatewayUrl(thumbnailUri), [thumbnailUri])
  const dateCreatedAt = useMemo(() => new Date(createdAt), [createdAt]);
  const urlArticle = `/article/${slug}`;
  return (
    <div className={cs(style.container, className, {
      [style.hover_effect]: settings.hoverEffectCard,
    })}>
      <Link href={urlArticle}>
        <a className={cs(style.link_wrapper)}/>
      </Link>
      <div className={style['img-wrapper']}>
        <Image
          src={thumbnailUrl}
          layout="fill"
          objectFit="cover"
          objectPosition="top"
          priority={imagePriority}
        />
      </div>
      <div className={style.infos}>
        <div className={style.infos_header}>
          <UserBadge
            hasLink
            user={author}
            size="regular"
            className={cs(style.author)}
          />
          <div className={style.date}>
            <time dateTime={format(dateCreatedAt, 'yyyy/MM/dd')}>
              {format(dateCreatedAt, 'MMMM d, yyyy')}
            </time>
          </div>
        </div>
        <Link href={urlArticle}>
          <a className={style.title}>
            <h4>{title}</h4>
          </a>
        </Link>
        <div className={style.description}>
          <p>
            {description}
          </p>
        </div>
        <Tags tags={tags}/>
      </div>
    </div>
  );
};

export const CardNftArticle = memo(_CardNftArticle);
