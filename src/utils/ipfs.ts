export function getIpfsIoUrl(cid: string) {
  return `https://ipfs.io/ipfs/${cid}`
}

export function getPinataUrlFromCid(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`
}

export function getIpfsSlash(cid: string): string {
  return `ipfs://${cid}`
}

/**
 * given an URL of the form `ipfs://frghrtjtyjtyj`
 * outputs the CID in the rightmost section
 */
export function ipfsUrlToCid(url: string): string {
  return url
    ? url.substr(7)
    : ""
}