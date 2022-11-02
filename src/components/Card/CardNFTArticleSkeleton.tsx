import React, { memo } from "react"
import cs from "classnames"
import style from "./CardNFTArticle.module.scss"
import Skeleton from "../Skeleton"

interface CardNftArticleSkeletonProps {
  className?: string
}

const _CardNftArticleSkeleton = ({
  className,
}: CardNftArticleSkeletonProps) => {
  return (
    <div className={cs(style.container, className)}>
      <div className={style.content}>
        <div className={style["img-wrapper"]}>
          <Skeleton height="100%" width="100%" />
        </div>
        <div className={style.infos}>
          <div className={style.infos_header}>
            <Skeleton height="37px" width="250px" />
          </div>
          <Skeleton height="33px" width="350px" />
          <div className={style.description}>
            <Skeleton height="80%" />
          </div>
          <div className={style.tags}>
            {[1, 2, 3].map((nb) => (
              <Skeleton key={nb} height="29px" width="84px" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const CardNftArticleSkeleton = memo(_CardNftArticleSkeleton)
