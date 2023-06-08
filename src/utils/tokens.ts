import { GenerativeToken } from "../types/entities/GenerativeToken"

export function canTokenBeBurned(token: GenerativeToken): boolean {
  return token.balance === token.supply
}
