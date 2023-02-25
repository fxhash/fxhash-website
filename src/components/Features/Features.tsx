import style from "./Features.module.scss"
import cs from "classnames"
import { TokenFeature } from "../../types/Metadata"
import { Feature } from "./Feature"
import { Objkt } from "../../types/entities/Objkt"
import { getGenerativeTokenUrl } from "../../utils/generative-token"
import { useMemo } from "react"

interface Props {
  features?: TokenFeature[] | null
  objkt?: Objkt | null
  layout?: "cols_2" | "responsive"
}

export function Features({ features, objkt, layout = "responsive" }: Props) {
  const projectUrl = useMemo(
    () => (objkt?.issuer ? getGenerativeTokenUrl(objkt.issuer) : ""),
    [objkt]
  )

  return features && features.length > 0 ? (
    <div className={cs(style.features, style[layout])}>
      {features.map((feature, idx) => (
        <Feature key={idx} feature={feature} projectUrl={projectUrl} />
      ))}
    </div>
  ) : (
    <em className={cs(style.no_features)}>
      The token does not implement features (features are not mandatory,
      it&apos;s up to you to decide if you want your Tokens to have features)
    </em>
  )
}
