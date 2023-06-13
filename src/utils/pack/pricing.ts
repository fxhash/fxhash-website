import { MichelsonMap } from "@taquito/taquito"
import {
  EBuildableParams,
  pack,
} from "../../services/parameters-builder/BuildParameters"
import { TInputPricingDutchAuction } from "../../services/parameters-builder/pricing-dutch-auction/input"
import { TInputPricingFixed } from "../../services/parameters-builder/pricing-fixed/input"
import { TInputPricing } from "../../services/parameters-builder/pricing/input"
import { GenTokPricing } from "../../types/entities/GenerativeToken"
import { IPricingFixed } from "../../types/entities/Pricing"
import { GenTokPricingForm } from "../../types/Mint"
import { genTokPricingToId } from "../generative-token"
import { transformPricingFixedInputToNumbers } from "../transformers/pricing"

/**
 * Packs the Pricing details of a PricingFixed form data
 */
export function packPricingFixed(input: TInputPricingFixed<number>): string {
  return pack(input, EBuildableParams.PRICING_FIXED)
}

export function packPricingDutchAuction(
  input: TInputPricingDutchAuction<number>
): string {
  return pack(input, EBuildableParams.PRICING_DUTCH_AUCTION)
}

/**
 * Takes some Pricing details as an input and outputs some data ready to be
 * sent to a contract
 */
export function packPricing(input: GenTokPricingForm<number>): TInputPricing {
  // we pack the pricing details depending on the pricing method
  let details: string
  if (input.pricingMethod === GenTokPricing.FIXED) {
    // if there's a date, get the epoch
    let opens_at = input.pricingFixed.opensAt
      ? input.pricingFixed.opensAt.getTime()
      : null
    // turn the string inputs into numbers
    details = packPricingFixed({
      price: input.pricingFixed.price!,
      opens_at: opens_at,
    })
  } else if (input.pricingMethod === GenTokPricing.DUTCH_AUCTION) {
    const levels = new MichelsonMap<number, number>()
    for (let i = 0; i < input.pricingDutchAuction.levels!.length; i++) {
      levels.set(i, input.pricingDutchAuction.levels![i])
    }
    details = packPricingDutchAuction({
      levels: levels,
      opens_at: input.pricingDutchAuction.opensAt!.getTime(),
      decrement_duration: input.pricingDutchAuction.decrementDuration! * 60,
    })
  }

  return {
    pricing_id: genTokPricingToId(input.pricingMethod!),
    lock_for_reserves: input.lockForReserves || false,
    details: details!,
  }
}
