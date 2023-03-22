import type { BigNumber } from "bignumber.js"
import { TTransformer } from "./Transformer"

export const DateTransformer: TTransformer<number, number, string, Date> = {
  __transformer: "__transformer",
  inUnpackedOutGeneric: (input) => new Date(input).toISOString(),
  inGenericOutInputready: (input) => new Date(input),
  inInputreadyOutGeneric: (input) => input.toISOString(),
  inGenericOutPackable: (input) => new Date(input).getTime(),
}
