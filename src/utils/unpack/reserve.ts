import type { MichelsonMap } from "@taquito/taquito"
import type { BigNumber } from "bignumber.js"
import { EBuildableParams, unpackBytes } from "../../services/parameters-builder/BuildParameters"
import { TInputReserve } from "../../services/parameters-builder/update-reserve/input"
import { EReserveMethod } from "../../types/entities/Reserve"
import { mapReserveIdtoEnum } from "../generative-token"

export function unpackReserve(
  reserve: TInputReserve<number>
) {
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
}