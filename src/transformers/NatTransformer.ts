import type { BigNumber } from "bignumber.js"
import { TTransformer } from "./Transformer"

export const NatTransformer: TTransformer<BigNumber, number, number, string> = {
  __transformer: "__transformer",
  inUnpackedOutGeneric: (input) => input.toNumber(),
  inGenericOutInputready: (input) => input.toFixed(),
  inInputreadyOutGeneric: (input) => parseInt(input),
  inGenericOutPackable: (input) => input,
}
