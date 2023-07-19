import { ipfsGatewayUrl } from "../services/Ipfs"
import { Objkt } from "../types/entities/Objkt"
import { FxhashContracts } from "../types/Contracts"
import { fxParamsAsQueryParams } from "components/FxParams/utils"
import sha1 from "sha1"

export function getObjktUrl(objkt: Objkt): string {
  return objkt.slug ? `/gentk/slug/${objkt.slug}` : `/gentk/${objkt.id}`
}

/**
 * Given an gentk which has an issuer, outputs a display URL for a live
 * version
 */
export function gentkLiveUrl({
  issuer,
  generationHash,
  iteration,
  inputBytes,
  minter,
  metadata,
}: Objkt): string {
  let query = `?fxhash=${generationHash}`
  query += `&fxiteration=${iteration}`
  query += `&fxminter=${minter!.id}`
  if (inputBytes) {
    if (fxParamsAsQueryParams(metadata?.snippetVersion || "3.2.0")) {
      query += `&fxparams=${inputBytes}`
    } else {
      query += `&fxparamsUpdate=${sha1(inputBytes)}`
      query += `#0x${inputBytes}`
    }
  }
  return ipfsGatewayUrl(`${issuer.generativeUri}/${query}`)
}

const contractPrefixes: Record<string, string> = {
  [FxhashContracts.GENTK_V1]: "FX0",
  [FxhashContracts.GENTK_V2]: "FX0",
  [FxhashContracts.GENTK_V3]: "FX1",
}
export function getObjktIdFromContract(contract: string, id: number): string {
  return `${contractPrefixes[contract]}-${id}`
}
