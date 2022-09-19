import style from "./FloorDifference.module.scss"
import cs from "classnames"
import colors from "../../styles/Colors.module.css"
import { useMemo } from "react"

interface Props {
  price: number
  floor: number | null
  append?: string
}
export function FloorDifference({ price, floor, append }: Props) {
  const ratio = useMemo(
    () => (floor != null ? price / floor : null),
    [price, floor]
  )
  const pct = useMemo(
    () => (ratio !== null ? Math.floor(ratio * 100) : null),
    [ratio]
  )

  return (
    <div>
      {ratio !== null ? (
        ratio < 1 ? (
          <strong className={cs(colors.error)}>
            -{100 - pct!} % {append}
          </strong>
        ) : (
          <strong className={cs(colors.success)}>
            +{pct! - 100} % {append}
          </strong>
        )
      ) : (
        "/"
      )}
    </div>
  )
}
