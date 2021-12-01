import { ConnectedUser, User, UserAlias, UserItems, UserRole } from "../types/entities/User"
import { truncateMiddle } from "./strings"

export function userHasName(user: ConnectedUser): boolean {
  return !!(user.name && user.name.length>0)
}

/**
 * if user has a name, then url uses its name, otherwise it uses its tkh
 */
export function getUserProfileLink(user: ConnectedUser): string {
  return userHasName(user) 
    ? `/u/${encodeURIComponent(user.name!)}`
    : `/pkh/${user.id}`
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


const UserModeratorRoles = [ UserRole.MODERATOR, UserRole.ADMIN ]
/**
 * Returns true if the user is a moderator / admin
 */
export function isModerator(user: User): boolean {
  return user.role && UserModeratorRoles.includes(user.role)
}

/**
 * Returns true if the user is a moderator / admin
 */
export function isAdmin(user: User): boolean {
  return user.role && user.role === UserRole.ADMIN
}

export interface TzProfile {
  twitter?: {
    handle: string|undefined|null,
    url: string|undefined|null,
  } | null,
  website?: {
    handle?: string,
    url?: string
  }
}

export function processUrl(url: string): { handle?: string, url?: string } {
  if (new RegExp("^(http|https)://").test(url)) {
    return {
      handle: url.replace(/(^\w+:|^)\/\//, ''),
      url
    }
  }
  else {
    return {
      handle: url,
      url: `https://${url}`
    }
  }
}

export function processTzProfile(data: any): TzProfile|null {
  try {
    let pData: TzProfile = {}
    for (const verif of data) {
      const verifData = JSON.parse(verif[1])
      if (verifData?.type?.includes("VerifiableCredential")) {
        // is it twitter ?
        if (verifData?.type?.includes("TwitterVerification")) {
          pData.twitter = {
            handle: verifData?.evidence?.handle,
            url: verifData?.credentialSubject?.sameAs
          }
        }
        // is it website ?
        if (verifData?.type?.includes("BasicProfile")) {
          pData.website = (verifData?.credentialSubject?.website && processUrl(verifData.credentialSubject.website)) || undefined
        }
      }
    }
    return pData.twitter || pData.website ? pData : null
  }
  catch {
    return null
  }
}

// a list of User aliases
export const UserAliases: Record<string, Partial<User>> = {
  [process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE!]: {
    id: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE!,
    name: "fxhash marketplace",
    description: "The official fxhash [beta] marketplace",
    role: UserRole.ADMIN,
    avatarUri: "ipfs://QmURUAU4YPa6Wwco3JSVrcN7WfCrFBZH7hY51BLrc87WjM"
  }
}

/**
 * Some accounts (such as the Marketplace contract) are displayed with a raw address
 * at different places on the platform.
 * This utility function can be called to update a User object if its address matches
 * an address in an alias list
 */
export function userAliases(user: User): User {
  if (UserAliases[user.id]) {
    return {
      ...user,
      ...UserAliases[user.id]
    }
  }
  return user
}