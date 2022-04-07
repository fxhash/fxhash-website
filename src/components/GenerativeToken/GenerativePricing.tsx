import style from "./GenerativePricing.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { DisplayTezos } from "../Display/DisplayTezos"
import { format, formatDuration, intervalToDuration } from "date-fns"
import { Fragment } from "react"
import { displayMutez } from "../../utils/units"
import { IconTezos } from "../Icons/IconTezos"
import { InfoIconLink } from "../Icons/InfoIconLink"
import { DutchAuctionLevels } from "./Pricing/DutchAuctionLevels"


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
      <strong>Price</strong>
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
            <DutchAuctionLevels
              levels={token.pricingDutchAuction.levels}
              activeLevel={token.pricingDutchAuction.finalPrice}
            />
            <span>
              changes every{" "}
              {formatDuration(
                intervalToDuration({
                  start: 0,
                  end: token.pricingDutchAuction.decrementDuration*1000
                })
              )}
            </span>
          </span>
        )}
      </span>

      {token.pricingFixed?.opensAt && (
        <>
          <strong>Minting opens</strong>
          <span>
            {format(
              new Date(token.pricingFixed.opensAt), 
              "MMMM d, yyyy' at 'HH:mm"
            )}
          </span>
        </>
      )}

      {token.pricingDutchAuction && (
        <>
          <strong>Auction starts</strong>
          <span>
            {format(
              new Date(token.pricingDutchAuction.opensAt!), 
              "MMMM d, yyyy' at 'HH:mm"
            )}
          </span>
        </>
      )}
    </>
  )
}