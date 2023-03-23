import style from "./Features.module.scss"
import cs from "classnames"
import { TokenFeature, TokenFeatureValueType } from "../../types/Metadata"
import { displayPercentage } from "../../utils/units"
import Link from "next/link"
import { defaultQueryParamSerialize } from "hooks/useQueryParam"
import { objktFeatureType } from "types/entities/Objkt"
import { Button } from "components/Button"

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
  // use defaultQueryParamSerialize as this route uses query params
  const serializedFeature = defaultQueryParamSerialize([
    {
      name: feature.name,
      values: [feature.value],
      type: objktFeatureType(feature.value),
    },
  ])
  return `${projectUrl}?features=${serializedFeature}`
}

const FeatureDetail = ({ feature }: { feature: TokenFeature }) => (
  <article
    className={cs(style.feature, {
      [style.has_rarity]: !!feature.rarity,
    })}
  >
    <div className={cs(style.details)}>
      <strong>{feature.name}</strong>
      <span>{displayFeatureValue(feature.value)}</span>
    </div>
    {feature.rarity && (
      <div className={cs(style.rarity)}>
        {displayPercentage(feature.rarity)}%
      </div>
    )}
  </article>
)

export function Feature({ feature, projectUrl }: Props) {
  if (!projectUrl) return <FeatureDetail feature={feature} />

  return (
    <Link href={getFeatureFilterUrl(projectUrl, feature)}>
      <Button className={cs(style.feature_link)} isLink color="transparent">
        <FeatureDetail feature={feature} />
      </Button>
    </Link>
  )
}
