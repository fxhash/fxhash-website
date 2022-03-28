import style from "./GenerativePricing.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { DisplayTezos } from "../Display/DisplayTezos"
import { format, formatDuration, intervalToDuration } from "date-fns"
import { Fragment } from "react"
import { displayMutez } from "../../utils/units"
import { IconTezos } from "../Icons/IconTezos"
import { InfoIconLink } from "../Icons/InfoIconLink"


interface Props {
  token: GenerativeToken  
}

/**
 * A module to display the pricing of a Generative Token in the token details
 * Responsible for handling the pricing method
 */
export function GenerativePricing({
  token,
}: Props) {
  return (
    <>
      <span className={cs(style.group)}>
        <strong>Price: </strong>
        <span>
          {token.pricingFixed && (
            <DisplayTezos
              mutez={token.pricingFixed.price}
              tezosSize="regular"
              formatBig={false}
            />
          )}

          {token.pricingDutchAuction && (
            <span className={cs(style.group_details)}>
              <span>
                <span>Dutch auction </span>
                <InfoIconLink
                  href="/doc/collect/pricing"
                  title="Learn more about Dutch Auctions"
                />
              </span>
              <span className={cs(style.levels)}>
                <IconTezos
                  className={cs(style.tezos_icon)}
                />
                {token.pricingDutchAuction.levels.map((level, idx) => (
                  <Fragment key={idx}>
                    {displayMutez(level)}
                    {idx !== token.pricingDutchAuction!.levels.length-1 && (
                      <span className={cs(style.sep)}>{"->"}</span>
                    )}
                  </Fragment>
                ))}
              </span>
              <span>
                {formatDuration(
                  intervalToDuration({
                    start: 0,
                    end: token.pricingDutchAuction.decrementDuration*1000
                  })
                )}
                <span> between decrements</span>
              </span>
            </span>
          )}
        </span>
      </span>

      {token.pricingFixed?.opensAt && (
        <span>
          <strong>Minting opens on: </strong>
          <span>
            {format(
              new Date(token.pricingFixed.opensAt), 
              "dd/MM/yyyy' at 'HH:mm"
            )}
          </span>
        </span>
      )}

      {token.pricingDutchAuction && (
        <span>
          <strong>Auction starts on: </strong>
          <span>
            {format(
              new Date(token.pricingDutchAuction.opensAt!), 
              "dd/MM/yyyy' at 'HH:mm"
            )}
          </span>
        </span>
      )}
    </>
  )
}