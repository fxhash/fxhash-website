import type { BigNumber } from "bignumber.js"
import { TTransformer } from "./Transformer"

export const MutezTransformer: TTransformer<BigNumber, number, number, string> =
  {
    __transformer: "__transformer",
    inUnpackedOutGeneric: (input) => input.toNumber(),
    inGenericOutInputready: (input) => (input / 1000000).toString(),
    inInputreadyOutGeneric: (input) => Math.floor(parseFloat(input) * 1000000),
    inGenericOutPackable: (input) => input,
  }
