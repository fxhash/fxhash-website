import { getIpfsIoUrl, getPinataFxhashGateway, getPinataUrlFromCid, getPinataFxhashGatewaySafe } from "../utils/ipfs"

// takes a stringas parameter, and if it matches an ipfs url returns the ID of the IPFS ressource
const ipfsRegex = new RegExp("^ipfs:\/\/")
export function ipfsUrlToID(url: string): string|null {
  if (!ipfsRegex.test(url)) return null
  return url.slice(7)
}

/**
 * Returns the CID or a resource, whether it's already a CID or an ipfs://<CID> resource
 * @param resource either a CID or a ipfs://<CID> string
 */
export function ipfsCidFromUriOrCid(resource: string): string {
  if (!ipfsRegex.test(resource)) return resource
  return resource.slice(7)
}

export function ipfsDisplayUrl(ipfsUrl: string|null|undefined) {
  if (!ipfsUrl || ipfsUrl.length < 15) return ""
  const cid = ipfsUrlToID(ipfsUrl)
  if (!cid) return ""
  return `https://ipfs.io/ipfs/${cid}`
}


/**
 * Given a CID or ipfs://<CID>, returns an URL to a gateway pointing to the resource
 * @param resource the resource input, either a CID or ipfs://<CID>
 * @param gateway the gateway URL to use for the resource
 */
export function ipfsGatewayUrl(
  resource: string|null|undefined,
  gateway: "ipfsio"|"pinata"|"pinata-fxhash"|"pinata-fxhash-safe" = "pinata-fxhash"
): string {
  if (!resource) return ""
  
  const cid = ipfsCidFromUriOrCid(resource)

  switch (gateway) {
    case "pinata-fxhash":
      return getPinataFxhashGateway(cid)
    case "pinata-fxhash-safe":
      return getPinataFxhashGatewaySafe(cid)
    case "pinata":
      return getPinataUrlFromCid(cid)
    case "ipfsio":
    default:
      return getIpfsIoUrl(cid)
  }
}