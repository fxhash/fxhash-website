import { UpdateIssuerForm } from "../../types/UpdateIssuer";

/**
 * Given a Generative Token Distribution string input, outputs its numbered
 * version (contract-friendly)
 */
 export function transformUpdateIssuerFormToNumbers(
  input: UpdateIssuerForm<string>
): UpdateIssuerForm<number> {
  return {
    ...input,
    editions: parseInt(input.editions!),
    royalties: Math.floor(parseFloat(input.royalties!)*10),
  }
}