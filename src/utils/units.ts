/**
 * Given a number in mutez, outputs a string with decimals provided, if any
 */
export function displayMutez(mutez: number, decimals: number = 2) {
  const tez = (mutez/1000000)
  const dec = tez - (tez|0)
  return ((dec * (10**decimals))|0) > 0 ? tez.toFixed(decimals) : (tez|0)
}