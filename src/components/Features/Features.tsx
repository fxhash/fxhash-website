import style from "./Features.module.scss"
import cs from "classnames"
import { TokenFeature } from "../../types/Metadata"
import { Feature } from "./Feature"


interface Props {
  features?: TokenFeature[] | null
  layout?: "cols_2" | "responsive"
}

export function Features({
  features,
  layout = "responsive"
}: Props) {
  return features && features.length > 0 ? (
    <div className={cs(style.features)}>
      {features.map((feature, idx) => (
        <Feature key={idx} feature={feature} />
      ))}
    </div>
  ):(
    <em className={cs(style.no_features)}>
      The token does not implement features (features are not madatory, it's up to you to decide if you want your Tokens to have features)
    </em>
  )
}