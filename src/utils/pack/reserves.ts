import { MichelsonMap } from "@taquito/michelson-encoder"
import {
  EBuildableParams,
  pack,
} from "../../services/parameters-builder/BuildParameters"
import {
  EReserveMethod,
  IReserve,
  IReserveMintInput,
} from "../../types/entities/Reserve"
import { mapReserveDefinition } from "../generative-token"

/**
 * Given a reserve from an input form, packs the data of the reserve and outputs
 * it. The packing strategy depends on the reserve method.
 */
export function packReserveData(input: IReserve<number>): string {
  let packed: string
  switch (input.method) {
    case EReserveMethod.WHITELIST: {
      const map = new MichelsonMap()
      for (const split of input.data) {
        map.set(split.address, split.pct)
      }
      packed = pack(map, EBuildableParams.RESERVE_WHITELIST)
      break
    }
    case EReserveMethod.MINT_PASS: {
      packed = pack(input.data, EBuildableParams.RESERVE_MINT_PASS)
      break
    }
  }
  return packed!
}

/**
 * Given a reserve input when minting from the issuer, packs the input
 */
export function packMintReserveInput(input: IReserveMintInput) {
  // we pack the reserve input data
  let packedInput: string | null = null
  switch (input.method) {
    case EReserveMethod.WHITELIST: {
      packedInput = null
      break
    }
    case EReserveMethod.MINT_PASS: {
      packedInput = pack(input.data, EBuildableParams.RESERVE_MINT_PASS_INPUT)
      break
    }
  }

  // now we pack an input
  const packed = pack(
    {
      method_id: mapReserveDefinition[input.method].id,
      input: packedInput,
    },
    EBuildableParams.RESERVE_MINT_INPUT
  )

  return packed
}
