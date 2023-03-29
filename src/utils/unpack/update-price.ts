import { TInputUpdatePriceV3 } from "./../../services/parameters-builder/update-price-v3/input"
import type { BigNumber } from "bignumber.js"
import {
  EBuildableParams,
  unpackBytes,
} from "../../services/parameters-builder/BuildParameters"
import { TInputUpdatePrice } from "../../services/parameters-builder/update-price/input"
import {
  transformUpdatePriceBigNumbers,
  transformUpdatePriceV3BigNumbers,
} from "../unpack-transformers/update-price"

export function unpackUpdatePrice(bytes: string): TInputUpdatePrice {
  // unpack (get BigNumbers)
  const unpacked = unpackBytes<TInputUpdatePrice<BigNumber>>(
    bytes,
    EBuildableParams.UPDATE_PRICE
  )
  // turns all the BigNumbers into JS numbers to consume easily
  return transformUpdatePriceBigNumbers(unpacked)
}

export function unpackUpdatePriceV3(bytes: string): TInputUpdatePriceV3 {
  // unpack (get BigNumbers)
  const unpacked = unpackBytes<TInputUpdatePriceV3<BigNumber>>(
    bytes,
    EBuildableParams.UPDATE_PRICE_V3
  )
  // turns all the BigNumbers into JS numbers to consume easily
  return transformUpdatePriceV3BigNumbers(unpacked)
}
