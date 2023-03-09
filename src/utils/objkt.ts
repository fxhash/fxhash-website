import { ipfsGatewayUrl } from "../services/Ipfs"
import { Objkt } from "../types/entities/Objkt"

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
}: Objkt): string {
  const query = inputBytes
    ? `/?fxhash=${generationHash}&fxparams=${inputBytes}`
    : `/?fxhash=${generationHash}`
  return ipfsGatewayUrl(`${issuer.generativeUri}/${query}`)
}
