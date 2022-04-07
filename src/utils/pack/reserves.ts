import { MichelsonMap } from "@taquito/michelson-encoder"
import { EBuildableParams, pack } from "../../services/parameters-builder/BuildParameters"
import { EReserveMethod, IReserve } from "../../types/entities/Reserve"

/**
 * Given a reserve from an input form, packs the data of the reserve and outputs
 * it. The packing strategy depends on the reserve method.
 */
export function packReserveData(
  input: IReserve<number>
): string {
  let packed: string
  if (input.method === EReserveMethod.WHITELIST) {
    // first we build a map from the input
    const map = new MichelsonMap()
    for (const split of input.data) {
      map.set(split.address, split.pct)
    }
    packed = pack(map, EBuildableParams.RESERVE_WHITELIST)
  }
  return packed!
}