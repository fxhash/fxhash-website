import type { MichelsonMap } from "@taquito/taquito"
import type { BigNumber } from "bignumber.js"
import { EBuildableParams, unpackBytes } from "../../services/parameters-builder/BuildParameters"
import { TInputUpdateReserve } from "../../services/parameters-builder/update-reserve/input"
import { EReserveMethod, IReserve } from "../../types/entities/Reserve"
import { mapReserveIdtoEnum } from "../generative-token"
import { transformUpdateReserveBigNumbers } from "../unpack-transformers/update-reserve"

export function unpackUpdateReserve(
  bytes: string,
): IReserve[] {
  // unpack (get BigNumbers)
  const unpacked = unpackBytes<TInputUpdateReserve<BigNumber>>(
    bytes,
    EBuildableParams.UPDATE_RESERVE,
  )
  // turns all the BigNumbers into JS numbers to consume easily
  const numbered = transformUpdateReserveBigNumbers(unpacked)

  // for each reserve, we unpack the data
  const reservesUnpacked = numbered.reserves.map(reserve => {
    const method = mapReserveIdtoEnum[reserve.method_id]
    let data: any
    if (method === EReserveMethod.WHITELIST) {
      const map = unpackBytes<MichelsonMap<string, BigNumber>>(
        reserve.data, 
        EBuildableParams.RESERVE_WHITELIST
      )
      // now turn the map into { address: amount }
      data = {}
      map.forEach((V, K) => data[K] = V.toNumber())
    }
    return {
      method: method,
      data: data,
      amount: reserve.amount,
    }
  })

  return reservesUnpacked
}