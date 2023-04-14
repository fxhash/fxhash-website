import { ipfsGatewayUrl } from "../services/Ipfs"
import { Objkt } from "../types/entities/Objkt"
import { FxhashContracts } from "../types/Contracts"

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
  inputBytes,
  minter,
}: Objkt): string {
  let query = `?fxhash=${generationHash}`
  query += `&fxminter=${minter!.id}`
  if (inputBytes) {
    query += `&fxparams=${inputBytes}`
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
