import React, { memo } from "react"
import styleUserBadge from "./UserBadge.module.scss"
import { IProps as IEntityBadgeProps } from "./EntityBadge"
import cs from "classnames"
import effect from "../../styles/Effects.module.scss"
import Skeleton from "../Skeleton"

interface UserBadgeLoadingProps
  extends Pick<IEntityBadgeProps, "size" | "avatarSide"> {
  number: number
}

const _UserBadgeLoading = ({
  number,
  avatarSide,
  size,
}: UserBadgeLoadingProps) => {
  return (
    <>
      {Array(number)
        .fill(0)
        .map((_, idx) => (
          <div
            className={cs(
              styleUserBadge.container,
              styleUserBadge[`side-${avatarSide}`]
            )}
            key={idx}
          >
            <div
              className={cs(
                styleUserBadge.avatar_loading,
                styleUserBadge[`avatar-${size}`],
                effect.placeholder
              )}
            />
            <Skeleton height="21px" width="50%" />
          </div>
        ))}
    </>
  )
}

export const UserBadgeLoading = memo(_UserBadgeLoading)
