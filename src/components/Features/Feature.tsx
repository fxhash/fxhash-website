import style from "./Features.module.scss"
import cs from "classnames"
import { TokenFeature, TokenFeatureValueType } from "../../types/Metadata"
import { displayPercentage } from "../../utils/units"
import Link from "next/link"

interface Props {
  feature: TokenFeature
  projectUrl?: string
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

function getFeatureFilterUrl(projectUrl: string, feature: TokenFeature) {
  return `${projectUrl}?features=${JSON.stringify({
    [feature.name]: feature.value,
  })}`
}

export function Feature({ feature, projectUrl }: Props) {
  return (
    <article
      className={cs(style.feature, { [style.has_rarity]: !!feature.rarity })}
    >
      <div className={cs(style.details)}>
        <strong>{feature.name}</strong>
        {projectUrl ? (
          <Link
            className={style.details_value}
            href={getFeatureFilterUrl(projectUrl, feature)}
          >
            {displayFeatureValue(feature.value)}
          </Link>
        ) : (
          <span>{displayFeatureValue(feature.value)}</span>
        )}
      </div>
      {feature.rarity && (
        <div className={cs(style.rarity)}>
          {displayPercentage(feature.rarity)}%
        </div>
      )}
    </article>
  )
}
