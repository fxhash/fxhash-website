const charSet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"

export const generateFxHash = () =>
  "oo" +
  Array(49)
    .fill(0)
    .map((_) => charSet[(Math.random() * charSet.length) | 0])
    .join("")

export function isHashValid(hash: string): boolean {
  if (hash.length !== 51) {
    return false
  }
  for (let i = 0; i < hash.length; i++) {
    if (!charSet.includes(hash[i])) return false
  }
  return true
}

export const generateTzAddress = () =>
  "tz1" +
  Array(33)
    .fill(0)
    .map((_) => charSet[(Math.random() * charSet.length) | 0])
    .join("")

export function isTzAddressValid(address: string): boolean {
  if (address.length !== 36) {
    return false
  }
  for (let i = 0; i < address.length; i++) {
    if (!charSet.includes(address[i])) return false
  }
  return true
}
