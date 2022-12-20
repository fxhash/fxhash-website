import style from "./RedeemableDetailsView.module.scss"
import cs from "classnames"
import { RedeemableDetails } from "types/entities/Redeemable"
import { plural } from "utils/strings"
import { ArticleContent } from "components/Article/ArticleContent"
import { DisplayTezos } from "components/Display/DisplayTezos"
import { Infobox } from "../UI/Infobox"
import { LinkGuide } from "../Link/LinkGuide"
import React from "react"
import { Spacing } from "../Layout/Spacing"
import { Button } from "../Button"
import { Icon } from "../Icons/Icon"
import Link from "next/link"
import { Error } from "../Error/Error"
import { CarouselRedeemable } from "../Redeemable/CarouselRedeemable";

interface Props {
  title: string
  details: RedeemableDetails
  info: any
  urlRedeem?: string
  error?: string | false
}
export function RedeemableDetailsView({
  details,
  title,
  info,
  urlRedeem,
  error,
}: Props) {
  return (
    <div className={cs(style.root)}>
      <div>
        <h3>{title}</h3>
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
        <Infobox className={style.info}>
          {info}
          <br />
          <br />
          <LinkGuide href="/docs">Learn more about Redeemable tokens</LinkGuide>
        </Infobox>
        {urlRedeem && !error && (
          <>
            <Spacing size="x-large" />
            <Link href={urlRedeem}>
              <Button
                isLink
                iconComp={<Icon icon="sparkles" />}
                color="secondary"
              >
                redeem your token
              </Button>
            </Link>
          </>
        )}
        {error && (
          <>
            <Spacing size="x-large" />
            <Error>{error}</Error>
          </>
        )}
      </div>
      <div className={style.right}>
        <CarouselRedeemable medias={details.medias} />
        {details.options?.length > 0 && (
          <div className={style.options}>
            <span>The following options are available:</span>
            <div className={style.options_grid}>
              {details.options.map((option, idx) => (
                <div
                  className={style.options_list}
                  key={`${option.label}${idx}`}
                >
                  <p>{option.label}:</p>
                  <ul>
                    {option.values.map((value, idx) => (
                      <li key={idx}>
                        {value.label}: <DisplayTezos mutez={value.amount} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
