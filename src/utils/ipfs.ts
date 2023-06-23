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
    fxparams?: string
    fxcontext?: string
  },
  transform: (cid: string) => string = ipfsGatewayUrl
) {
  let url = `${transform(cid)}/?fxhash=${urlParams.fxhash}&fxiteration=${
    urlParams.fxiteration
  }&fxminter=${urlParams.fxminter}`
  if (urlParams.fxcontext) url += `&fxcontext=${urlParams.fxcontext}`
  if (urlParams.fxparams) url += `&fxparams=${urlParams.fxparams}`
  return url
}

export function appendUrlParameters(
  url: string,
  parameters: Record<string, string | number | null>
): string {
  const params = Object.entries(parameters)
    .filter(([key, value]) => value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
    )
    .join("&")

  if (params) {
    return `${url}${url.includes("?") ? "&" : "?"}${params}`
  }

  return url
}

export function urlAddTokenParams(
  base: string,
  hash: string,
  minter: string,
  params: string | null | undefined
) {
  let url = `${base}&fxhash=${hash}&fxminter=${minter}`
  if (params) url += `&fxparams=${params}`
  return url
}

/**
 * Is an URI an IPFS uri ?
 */
export function isUriIpfs(uri: string) {
  return uri.startsWith("ipfs://")
}
