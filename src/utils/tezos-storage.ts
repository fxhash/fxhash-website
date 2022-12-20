/**
 * A list of Utils to support tezos-storage-pointer specification
 * tezos-storage-pointer is a list of properties aiming at targetting content
 * stored on tezos smart contracts.
 */

import { FxhashContracts } from "../types/Contracts"
import { GenerativeToken } from "../types/entities/GenerativeToken"
import { Objkt } from "../types/entities/Objkt"
import { ITezosStoragePointer } from "../types/TezosStorage"
import { getGentkFA2Contract } from "./gentk"

/**
 * Given a Generative Token, outputs the Tezos Storage Pointer properties
 * associated
 */
export function generativeTokenTezosStoragePointer(
  token: GenerativeToken
): ITezosStoragePointer {
  return {
    contract: FxhashContracts.ISSUER,
    path: `ledger::${token.id}`,
    storage_type: undefined,
    // the specification of the metadata
    data_spec: "FX-GEN-DATA-002",
    value_path: undefined,
  }
}

/**
 * Given a Gentk, outputs the Tezos Storage Pointer properties
 */
export function gentkTezosStoragePointer(
  gentk: Objkt
): ITezosStoragePointer {
  return {
    contract: getGentkFA2Contract(gentk),
    path: `token_metadata::${gentk.id}`,
    storage_type: undefined,
    data_spec: undefined,
    value_path: undefined,
  }
}