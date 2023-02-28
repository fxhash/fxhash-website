export enum EGatewayIpfs {
  FXHASH = "FXHASH",
  FXHASH_SAFE = "FXHASH_SAFE",
  IPFSIO = "IPFSIO",
}

/**
 * Given a gateway enum, outputs the http url root of the gateway
 */
export function ipfsGatewayRoot(gateway: EGatewayIpfs): string {
  switch (gateway) {
    case EGatewayIpfs.FXHASH:
      return process.env.NEXT_PUBLIC_IPFS_GATEWAY!
    case EGatewayIpfs.FXHASH_SAFE:
      return process.env.NEXT_PUBLIC_IPFS_GATEWAY_SAFE!
    case EGatewayIpfs.IPFSIO:
    default:
      return "https://ipfs.io"
  }
}

// takes a stringas parameter, and if it matches an ipfs url returns the ID of the IPFS ressource
const ipfsRegex = new RegExp("^ipfs://")
export function ipfsUrlToID(url: string): string | null {
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

/**
 * Given a CID or ipfs://<CID>, returns an URL to a gateway pointing to the resource
 * @param resource the resource input, either a CID or ipfs://<CID>
 * @param gateway the gateway URL to use for the resource
 */
export function ipfsGatewayUrl(
  resource: string | null | undefined,
  gateway: EGatewayIpfs = EGatewayIpfs.FXHASH_SAFE
): string {
  if (!resource) return ""
  const cid = ipfsCidFromUriOrCid(resource)
  return `${ipfsGatewayRoot(gateway)}/ipfs/${cid}`
}
