/**
 * Truncates a string [str] in the middle so that the total length of the both sides is
 * equal to [length] / 2. [join] is added between the sides
 * If string.length <= [length], returns string
 */
export function truncateMiddle(str: string, length: number, join: string = "...") {
  if (str.length <= length) return str
  const sl = (length*0.5)|0
  return str.slice(0, sl) + join + str.slice(-sl)
}