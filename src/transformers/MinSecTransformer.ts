import type { BigNumber } from "bignumber.js"
import { TTransformer } from "./Transformer"

/**
 * can be used when the form input needs to display minutes but it needs to
 * be stored as seconds
 */
export const MinSecTransformer: TTransformer<
  BigNumber,
  number,
  number,
  string
> = {
  __transformer: "__transformer",
  inUnpackedOutGeneric: (input) => input.toNumber(),
  inGenericOutInputready: (input) => (input / 60).toFixed(0),
  inInputreadyOutGeneric: (input) => parseInt(input) * 60,
  inGenericOutPackable: (input) => input,
}
