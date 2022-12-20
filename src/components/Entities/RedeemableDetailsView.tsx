import style from "./RedeemableDetailsView.module.scss"
import cs from "classnames"
import { RedeemableDetails } from "types/entities/Redeemable"
import { plural } from "utils/strings"
import { ArticleContent } from "components/Article/ArticleContent"
import { DisplayTezos } from "components/Display/DisplayTezos"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Infobox } from "../UI/Infobox"
import { LinkGuide } from "../Link/LinkGuide"
import React, { useState } from "react"
import { Spacing } from "../Layout/Spacing"
import { Carousel } from "../Carousel/Carousel"
import { Image } from "../Image"

interface Props {
  token: GenerativeToken
  details: RedeemableDetails
}
export function RedeemableDetailsView({ details, token }: Props) {
  const [pageMedias, setPageMedias] = useState(0)
  return (
    <div className={cs(style.root)}>
      <div>
        <h3>{token.name}</h3>
        <Spacing size="x-large" />
        <h4>{details.name}</h4>
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
        <Infobox>
          The iterations of this project can be redeemed to activate an event. Redeeming a token will not destroy it, and owners will keep the
          ownership of their token.
          <br />
          <br />
          <LinkGuide href="/docs">Learn more about Redeemable tokens</LinkGuide>
        </Infobox>
      </div>
      <div className={style.right}>
        <Carousel
          className={style.carousel}
          classNameDots={style.dots}
          page={pageMedias}
          totalPages={details.medias.length}
          onChangePage={setPageMedias}
          options={{
            showButtonControls: false,
            showDots: true,
          }}
          renderSlide={(page) => {
            const med = details.medias[page]
            return (
              <div className={style.container_img}>
                <img alt={med.media.name} src={med.media.url} />
              </div>
            )
          }}
        />
        {details.options?.length > 0 && (
          <div className={style.options}>
            <span>The following options are available:</span>
            <div className={style.options_grid}>
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
