import { IPricingDutchAuction, IPricingFixed } from "../../types/entities/Pricing";
import { GenTokPricingForm } from "../../types/Mint";

/**
 * Turns a string tezos input into an int number
 */
export function transformTezosInputToMutezNumber(input: string) {
  return Math.floor(parseFloat(input)*1000000)
}

/**
 * Turns a tezos mutez price int into a string/1000000
 */
export function transformTezosMutezToInputString(mutez: number) {
  return (mutez/1000000).toFixed()
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
 * Turns the numbers in the pricing fixed into strings
 */
export function transformPricingFixedNumbersToString(
  input: IPricingFixed<number>
): IPricingFixed<string> {
  return {
    price: transformTezosMutezToInputString(input.price),
    opensAt: new Date(input.opensAt as any)
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
 * Turns the mutez numbers in the pricing dutch auction into string tez
 */
 export function transformPricingDutchNumbersToString(
  input: IPricingDutchAuction<number>
): IPricingDutchAuction<string> {
  return {
    levels: input.levels.map(v => transformTezosMutezToInputString(v)),
    decrementDuration: (input.decrementDuration/60).toFixed(0),
    opensAt: new Date(input.opensAt as any)
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
    pricingFixed: input.pricingFixed ? transformPricingFixedInputToNumbers(
      input.pricingFixed as IPricingFixed<string>
    ):null as any,
    pricingDutchAuction: input.pricingDutchAuction
    ? transformPricingDutchInputToNumbers(
      input.pricingDutchAuction as IPricingDutchAuction<string>
    ):null as any
  }
}

/**
 * Turns the string of a whole Gen Tok Pricing Form into numbers
 */
export function transformPricingNumbersToString(
  input: GenTokPricingForm<number>
): GenTokPricingForm<string> {
  return {
    ...input,
    pricingFixed: transformPricingFixedNumbersToString(
      input.pricingFixed as IPricingFixed<number>
    ),
    pricingDutchAuction: transformPricingDutchNumbersToString(
      input.pricingDutchAuction as IPricingDutchAuction<number>
    )
  }
}