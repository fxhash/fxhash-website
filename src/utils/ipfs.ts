import { ipfsGatewayUrl } from "../services/Ipfs"
import { generateRandomStringSequence } from "./getRandomStringSequence"
import sha1 from "sha1"

export function getIpfsSlash(cid: string): string {
  return `ipfs://${cid}`
}

/**
 * Generic method to get a display url based on a CID and a hash.
 * This function also accepts a transform method so that the base URL can be
 * formed in any way using the cid
 */
export function ipfsUrlWithHash(
  cid: string,
  hash: string,
  transform: (cid: string) => string = ipfsGatewayUrl
) {
  return `${transform(cid)}/?fxhash=${hash}`
}

export function ipfsUrlWithHashAndParams(
  cid: string,
  urlParams: {
    fxhash?: string
    fxiteration?: number | string
    fxminter?: string
    fxparams?: string | null
    fxParamsAsQueryParams?: boolean
    fxcontext?: string
    noFxParamsUpdateQuery?: boolean
  },
  transform: (cid: string) => string = ipfsGatewayUrl
) {
  let url = `${transform(cid)}/?fxhash=${urlParams.fxhash}&fxiteration=${
    urlParams.fxiteration
  }&fxminter=${urlParams.fxminter}`
  if (urlParams.fxcontext) url += `&fxcontext=${urlParams.fxcontext}`
  if (urlParams.fxparams) {
    if (urlParams.fxParamsAsQueryParams) {
      url += `&fxparams=${urlParams.fxparams}`
    } else {
      if (!urlParams.noFxParamsUpdateQuery) {
        url += `&fxparamsUpdate=${sha1(urlParams.fxparams)}`
      }
      url += `#0x${urlParams.fxparams}`
    }
  }
  return url
}

/**
 * Is an URI an IPFS uri ?
 */
export function isUriIpfs(uri: string) {
  return uri.startsWith("ipfs://")
}
