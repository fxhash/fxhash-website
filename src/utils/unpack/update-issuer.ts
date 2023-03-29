import type { BigNumber } from "bignumber.js"
import {
  EBuildableParams,
  unpackBytes,
} from "../../services/parameters-builder/BuildParameters"
import { TInputUpdateIssuer } from "../../services/parameters-builder/update-issuer/input"
import { transformUpdateIssuerBigNumbers } from "../unpack-transformers/update-issuer"

export function unpackUpdateIssuer(bytes: string): TInputUpdateIssuer<number> {
  // unpack (get BigNumbers)
  const unpacked = unpackBytes<TInputUpdateIssuer<BigNumber>>(
    bytes,
    EBuildableParams.UPDATE_ISSUER
  )

  // turns all the BigNumbers into JS numbers to consume easily
  return transformUpdateIssuerBigNumbers(unpacked)
}
