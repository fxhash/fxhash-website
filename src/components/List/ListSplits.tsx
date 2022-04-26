import style from "./ListSplits.module.scss"
import text from "../../styles/Text.module.css"
import cs from "classnames"
import { Split } from "../../types/entities/Split"
import { UserBadge } from "../User/UserBadge"
import { displayPercentage } from "../../utils/units"
import { Fragment, useState } from "react"
import { ToggableInfo } from "../Layout/ToggableInfo"
import { ConnectedList } from "../Layout/ConnectedList"

interface Props {
  name: string
  splits: Split[]
  toggled?: boolean
}
export function ListSplits({
  name,
  splits,
  toggled,
}: Props) {
  return (
    <ToggableInfo
      label={name}
      placeholder={`(${splits.length})`}
      toggled={toggled}
    >
      <ConnectedList
        items={splits}
      >
        {({ item }) => (
          <>
            <span className={cs(style.pct)}>
              {displayPercentage(item.pct/1000)}%
            </span>
            <div>
	      <UserBadge
		className={style.user}
                size="small"
                user={item.user}
                displayAvatar={false}
              />
            </div>
          </>
        )}
      </ConnectedList>
    </ToggableInfo>
  )
}
