export function getIpfsIoUrl(cid: string) {
  return `https://ipfs.io/ipfs/${cid}`
}

export function getIpfsSlash(cid: string): string {
  return `ipfs://${cid}`
}