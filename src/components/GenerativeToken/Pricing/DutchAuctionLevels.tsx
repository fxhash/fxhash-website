import style from "./DutchAuctionLevels.module.scss"
import cs from "classnames"
import { IconTezos } from "../../Icons/IconTezos"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { displayMutez } from "../../../utils/units"
import { Fragment } from "react"

interface Props {
  levels: number[]
  activeLevel?: number
}
export function DutchAuctionLevels({ levels, activeLevel }: Props) {
  return (
    <span className={cs(style.levels)}>
      <IconTezos className={cs(style.tezos_icon)} />
      {levels.map((level, idx) => (
        <Fragment key={idx}>
          <span
            className={cs({
              [style.active_price]: level === activeLevel,
            })}
          >
            {displayMutez(level)}
          </span>
          {idx !== levels.length - 1 && (
            <span className={cs(style.sep)}>{"->"}</span>
          )}
        </Fragment>
      ))}
    </span>
  )
}
