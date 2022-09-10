import type { BigNumber } from "bignumber.js"
import { EBuildableParams, unpackBytes } from "../../services/parameters-builder/BuildParameters"
import { TInputUpdatePrice } from "../../services/parameters-builder/update-price/input"
import { transformUpdatePriceBigNumbers } from "../unpack-transformers/update-price"

export function unpackUpdatePrice(
  bytes: string,
): TInputUpdatePrice {
  // unpack (get BigNumbers)
  const unpacked = unpackBytes<TInputUpdatePrice<BigNumber>>(
    bytes,
    EBuildableParams.UPDATE_PRICE,
  )
  // turns all the BigNumbers into JS numbers to consume easily
  return transformUpdatePriceBigNumbers(unpacked)
}