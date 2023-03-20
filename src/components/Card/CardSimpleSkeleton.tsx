import React, { memo } from "react"
import style from "./CardSimple.module.scss"
import cs from "classnames"
import Skeleton from "../Skeleton"

interface CardSimpleSkeletonProps {
  className?: string
}

const _CardSimpleSkeleton = ({ className }: CardSimpleSkeletonProps) => {
  return (
    <div className={cs(className, style.container)}>
      <Skeleton height="250px" />
      <div className={style.skeleton_title}>
        <Skeleton height="32px" width="60%" />
      </div>
      <div>
        <Skeleton height="32px" width="30%" />
      </div>
    </div>
  )
}

export const CardSimpleSkeleton = memo(_CardSimpleSkeleton)
