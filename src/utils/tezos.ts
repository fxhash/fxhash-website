const contractAddressRegex = /^KT1[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{33}$/

/**
 * Checks whether a string is a valid contract address.
 * Uses a regex to check for validity
 */
export function isContractAddress(input: string): boolean {
  return contractAddressRegex.test(input)
}