import style from "./Features.module.scss"
import cs from "classnames"
import { TokenFeature, TokenFeatureValueType } from "../../types/Metadata"
import { displayPercentage } from "../../utils/units"

interface Props {
  feature: TokenFeature
}

function displayFeatureValue(value: TokenFeatureValueType) {
  const type = typeof value
  switch (type) {
    case "boolean":
      return value ? "true" : "false"
    case "number":
      return value.toString()
    case "string":
    default:
      return value
  }
}

export function Feature({ feature }: Props) {
  return (
    <article
      className={cs(style.feature, { [style.has_rarity]: !!feature.rarity })}
    >
      <div className={cs(style.details)}>
        <strong>{feature.name}</strong>
        <span className={style.details_value}>
          {displayFeatureValue(feature.value)}
        </span>
      </div>
      {feature.rarity && (
        <div className={cs(style.rarity)}>
          {displayPercentage(feature.rarity)}%
        </div>
      )}
    </article>
  )
}
