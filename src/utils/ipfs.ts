import { ipfsGatewayUrl } from "../services/Ipfs"

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
  transform: ((cid: string) => string) = ipfsGatewayUrl
) {
  return `${transform(cid)}/?fxhash=${hash}`
}

/**
 * Is an URI an IPFS uri ?
 */
export function isUriIpfs(uri: string) {
  return uri.startsWith("ipfs://")
}