// takes a stringas parameter, and if it matches an ipfs url returns the ID of the IPFS ressource
const ipfsRegex = new RegExp("^ipfs:\/\/")
export function ipfsUrlToID(url: string): string|null {
  if (!ipfsRegex.test(url)) return null
  return url.slice(7)
}

export function ipfsDisplayUrl(ipfsUrl: string|null|undefined) {
  if (!ipfsUrl || ipfsUrl.length < 15) return ""
  const cid = ipfsUrlToID(ipfsUrl)
  if (!cid) return ""
  return `https://ipfs.io/ipfs/${cid}`
}