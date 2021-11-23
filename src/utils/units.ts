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

/**
 * Given a number in the [0; 1] range, displays the percentage in an elegant manner
 */
export function displayPercentage(x: number): string {
  const x100 = x * 100
  // if x100 < precision, return like it
  if (x100 < 0.0001) return "< 0.0001"

  let fixed = x100.toFixed(1)
  // check if right part is made of 0's only
  let right = fixed.split(".").pop()
  if (right && parseInt(right) === 0) {
    return fixed.split(".")[0]
  }
  else {
    return fixed
  }
}

export function prettyPrintBytes(size: number): string {
  const units = [ "B", "KB", "MB" ]
  let s = size
  for (const unit of units) {
    if (s < 1000) {
      return s.toFixed(0) + unit
    }
    s/= 1024
  }
  return s.toFixed(0) + "GB"
}