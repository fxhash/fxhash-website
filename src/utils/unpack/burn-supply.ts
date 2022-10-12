import type { BigNumber } from "bignumber.js"
import { EBuildableParams, unpackBytes } from "../../services/parameters-builder/BuildParameters"
import { TInputBurnSupply } from "../../services/parameters-builder/burn-supply/input"
import { transformBurnSupplyBigNumbers } from "../unpack-transformers/burn-supply"

export function unpackBurnSupply(bytes: string): TInputBurnSupply<number> {
  // unpack (get BigNumbers)
  const unpacked = unpackBytes<TInputBurnSupply<BigNumber>>(
    bytes,
    EBuildableParams.BURN_SUPPLY
  )

  // turns all the BigNumbers into JS numbers to consume easily
  return transformBurnSupplyBigNumbers(unpacked)
}