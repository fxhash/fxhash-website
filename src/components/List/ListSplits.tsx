import style from "./ListSplits.module.scss"
import cs from "classnames"
import { Split } from "../../types/entities/Split"
import { UserBadge } from "../User/UserBadge"
import { displayPercentage } from "../../utils/units"
import { Fragment } from "react"

interface Props {
  name: string
  splits: Split[]
}
export function ListSplits({
  name,
  splits,
}: Props) {
  return (
    <div className={cs(style.root)}>
      <strong>{name}</strong>
      <div className={cs(style.splits)}>
        {splits.map((split, idx) => (
          <Fragment
            key={idx}
          >
            <span className={cs(style.pct)}>
              {displayPercentage(split.pct/1000)}%
            </span>
            <div className={cs(style.user)}>
              <UserBadge
                size="small"
                user={split.user}
                displayAvatar={false}
              />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}