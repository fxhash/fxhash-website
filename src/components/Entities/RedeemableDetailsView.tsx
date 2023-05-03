import style from "./RedeemableDetailsView.module.scss"
import text from "../../styles/Text.module.css"
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
import { CarouselRedeemable } from "../Redeemable/CarouselRedeemable"
import { DateFormatted } from "components/Utils/Date/DateFormat"

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

        {urlRedeem && !error && (
          <>
            <div className={cs(style.redeem_btn_wrapper)}>
              <Link href={urlRedeem}>
                <Button
                  isLink
                  iconComp={<Icon icon="sparkles" />}
                  color="secondary"
                >
                  redeem your token
                </Button>
              </Link>
            </div>
            <Spacing size="large" />
          </>
        )}

        <h4>{details.name}</h4>

        <div className={cs(style.medias_mobile)}>
          <CarouselRedeemable medias={details.medias} />
        </div>

        <p className={cs(text.info)}>
          Every iteration of this project can be redeemed{" "}
          <strong>
            {details.maxConsumptions} time{plural(details.maxConsumptions)}
          </strong>
          <br />
          Base redemption cost is{" "}
          <DisplayTezos mutez={details.amount} tezosSize="regular" />
          {details.expiresAt && (
            <>
              <br />
              Redeemable until <DateFormatted date={details.expiresAt} />
            </>
          )}
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
        <div className={cs(style.medias_desktop)}>
          <CarouselRedeemable medias={details.medias} />
        </div>
        {details.options?.length > 0 && (
          <div className={style.options}>
            <span>The following options are available:</span>
            <Spacing size="regular" />
            <div className={style.options_grid}>
              {details.options.map((option, idx) => (
                <div
                  className={style.options_list}
                  key={`${option.label}${idx}`}
                >
                  <strong>{option.label}</strong>
                  <ul>
                    {option.values.map((value, idx) => (
                      <li key={idx}>
                        {value.label}{" "}
                        <span className={cs(style.option_dash)}>—</span>{" "}
                        <DisplayTezos mutez={value.amount} formatBig={false} />
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
