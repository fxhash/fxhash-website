import { GenTokDistributionForm, MintGenerativeData } from "../../types/Mint"
import { transformPricingFormToNumbers } from "./pricing"

/**
 * Given a Generative Token Distribution string input, outputs its numbered
 * version (contract-friendly)
 */
export function transformGenTokDistribFormToNumbers(
  input: GenTokDistributionForm<string>
): GenTokDistributionForm<number> {
  return {
    ...input,
    editions: parseInt(input.editions!),
    royalties: Math.floor(parseFloat(input.royalties!) * 10),
    pricing: transformPricingFormToNumbers(input.pricing),
    reserves: input.reserves as any,
  }
}

/**
 * Given a Generative Token Form input with strings, outputs a numbered version
 * in which key properties are swapped to be contract-friendly
 */
export function transformGenTokFormToNumbers(
  input: MintGenerativeData<string>
): MintGenerativeData<number> {
  return {
    // we spread most of the properties, rewrite after if needed
    ...input,
    distribution: transformGenTokDistribFormToNumbers(input.distribution!),
  }
}
