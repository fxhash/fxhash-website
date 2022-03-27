import { IPricingDutchAuction, IPricingFixed } from "../../types/entities/Pricing";
import { GenTokPricingForm } from "../../types/Mint";

/**
 * Turns a string tezos input into an int number
 */
export function transformTezosInputToMutezNumber(input: string) {
  return Math.floor(parseFloat(input)*1000000)
}

/**
 * Turns the strings in the pricing fixed input into numbers
 */
export function transformPricingFixedInputToNumbers(
  input: IPricingFixed<string>
): IPricingFixed<number> {
  return {
    price: transformTezosInputToMutezNumber(input.price),
    opensAt: input.opensAt
  }
}

/**
 * Turns the strings in the pricing dutch auction into mutez numbers
 */
 export function transformPricingDutchInputToNumbers(
  input: IPricingDutchAuction<string>
): IPricingDutchAuction<number> {
  return {
    levels: input.levels.map(v => transformTezosInputToMutezNumber(v)),
    decrementDuration: parseInt(input.decrementDuration),
    opensAt: input.opensAt
  }
}

/**
 * Turns the string of a whole Gen Tok Pricing Form into numbers
 */
export function transformPricingFormToNumbers(
  input: GenTokPricingForm<string>
): GenTokPricingForm<number> {
  return {
    ...input,
    pricingFixed: transformPricingFixedInputToNumbers(
      input.pricingFixed as IPricingFixed<string>
    ),
    pricingDutchAuction: transformPricingDutchInputToNumbers(
      input.pricingDutchAuction as IPricingDutchAuction<string>
    )
  }
}