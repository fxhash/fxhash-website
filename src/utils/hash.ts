const charSet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
export const generateFxHash = () => "oo" + Array(49).fill(0).map(_=>charSet[(Math.random()*charSet.length)|0]).join('')

export function isHashValid(hash: string): boolean {
  if (hash.length !== 51) {
    return false
  }
  for (let i = 0; i < hash.length; i++) {
    if (!charSet.includes(hash[i])) return false
  }
  return true
}