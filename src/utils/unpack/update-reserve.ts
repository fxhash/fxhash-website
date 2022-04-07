import type { MichelsonMap } from "@taquito/taquito"
import type { BigNumber } from "bignumber.js"
import { EBuildableParams, unpackBytes } from "../../services/parameters-builder/BuildParameters"
import { TInputUpdateReserve } from "../../services/parameters-builder/update-reserve/input"
import { EReserveMethod, IReserve } from "../../types/entities/Reserve"
import { mapReserveIdtoEnum } from "../generative-token"
import { transformUpdateReserveBigNumbers } from "../unpack-transformers/update-reserve"
import { unpackReserve } from "./reserve"


export function unpackUpdateReserve(
  bytes: string,
) {
  // unpack (get BigNumbers)
  const unpacked = unpackBytes<TInputUpdateReserve<BigNumber>>(
    bytes,
    EBuildableParams.UPDATE_RESERVE,
  )
  // turns all the BigNumbers into JS numbers to consume easily
  const numbered = transformUpdateReserveBigNumbers(unpacked)

  // for each reserve, we unpack the data
  const reservesUnpacked = numbered.reserves.map(
    reserve => unpackReserve(reserve)
  )

  return {
    issuer_id: unpacked.issuer_id.toNumber(),
    reserves: reservesUnpacked,
  }
}