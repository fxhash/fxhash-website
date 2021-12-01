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

/**
 * Truncates a string at the end if its length is > maxLength
 * @param str a string from which a may need to be truncated
 * @param maxLength the maximum length the string can have
 * @param append optional string section to add at the end of the truncated string
 * @returns either the whole string if length < maxLength or a truncated section if not
 */
export function truncateEnd(str: string, maxLength: number, append: string = "...") {
  if (str.length > maxLength) {
    str = str.slice(0, maxLength) + append
  }
  return str
}

export function tagsFromString(str: string): string[] {
  return str.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0)
}