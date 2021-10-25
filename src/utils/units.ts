import { getMutezDecimalsNb } from "./math"


/**
 * Given a number in mutez, outputs a string with decimals provided, if any
 */
export function displayMutez(mutez: number) {
  const decimals = getMutezDecimalsNb(mutez)
  const tez = (mutez/1000000)
  const dec = tez - (tez|0)
  return ((dec * (10**decimals))|0) > 0 ? tez.toFixed(decimals) : (tez|0)
}

export function displayRoyalties(royalties: number): string {
  return (royalties/10).toFixed(1) + '%'
}

export function prettyPrintBytes(size: number): string {
  const units = [ "B", "KB", "MB" ]
  let s = size
  let ret
  for (const unit of units) {
    if (s < 1000) {
      return s.toFixed(0) + unit
    }
    s/= 1024
  }
  return s.toFixed(0) + "GB"
}