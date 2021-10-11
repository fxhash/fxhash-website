import { User } from "../types/entities/User"
import { truncateMiddle } from "./strings"

export function userHasName(user: User): boolean {
  return !!(user.name && user.name.length>0)
}

/**
 * if user has a name, then url uses its name, otherwise it uses its tkh
 */
export function getUserProfileLink(user: User): string {
  return userHasName(user) 
    ? `/u/${encodeURIComponent(user.name!)}`
    : `/tkh/${user.id}`
}

/**
 * Given a user, returns its name. If user doesn't have a name or if name is empty,
 * then returns its pkh but truncated in the middle, with triple dots
 */
export function getUserName(user: User, truncateLength?: number): string {
  return userHasName(user) 
    ? user.name! 
    : (truncateLength ? truncateMiddle(user.id, truncateLength) : user.id)
}