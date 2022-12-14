import style from "./RedeemableDetailsView.module.scss"
import cs from "classnames"
import { RedeemableDetails } from "types/entities/Redeemable"
import { plural } from "utils/strings"
import { ArticleContent } from "components/Article/ArticleContent"
import { DisplayTezos } from "components/Display/DisplayTezos"

interface Props {
  details: RedeemableDetails
}
export function RedeemableDetailsView({ details }: Props) {
  return (
    <div className={cs(style.root)}>
      <h3>{details.name}</h3>
      <div className={cs(style.carousel)}>
        {details.medias.map((med) => (
          <img key={med.index} src={med.media.url} alt={med.media.name} />
        ))}
      </div>
      <p>
        Every iteration of this project can be redeemed{" "}
        <strong>
          {details.maxConsumptions} {plural("time", details.maxConsumptions)}
        </strong>
        .<br />
        The base cost to redeem iterations of this project is{" "}
        <DisplayTezos mutez={details.amount} />
      </p>
      <div className={cs(style.description)}>
        <ArticleContent
          content={details.description}
          // className={cs(style.body)}
        />
      </div>
      {details.options?.length > 0 && (
        <p>
          The following options are available:
          {details.options.map((option, idx) => (
            <ul key={idx}>
              <li>{option.label}</li>
              <ul>
                {option.values.map((value, idx) => (
                  <li key={idx}>
                    {value.label}: <DisplayTezos mutez={value.amount} />
                  </li>
                ))}
              </ul>
            </ul>
          ))}
        </p>
      )}
    </div>
  )
}
