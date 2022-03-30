import style from "./ListSplits.module.scss"
import colors from "../../styles/Colors.module.css"
import text from "../../styles/Text.module.css"
import cs from "classnames"
import { Split } from "../../types/entities/Split"
import { UserBadge } from "../User/UserBadge"
import { displayPercentage } from "../../utils/units"
import { Fragment, useState } from "react"

interface Props {
  name: string
  splits: Split[]
  toggled?: boolean
}
export function ListSplits({
  name,
  splits,
  toggled = false,
}: Props) {
  const [opened, setOpened] = useState<boolean>(toggled)

  return (
    <div className={cs(style.root)}>
      <button
        type="button"
        onClick={() => setOpened(!opened)}
        className={cs(style.btn_toggle)}
      >
        <i className={`fa-solid fa-angle-${opened?"up":"down"}`} aria-hidden/>
        <strong>{name} </strong>
        <span className={cs(text.info)}>
          ({splits.length})
        </span>
      </button>

      {opened && (
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
      )}
    </div>
  )
}