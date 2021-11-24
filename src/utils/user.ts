import { ConnectedUser, User, UserItems } from "../types/entities/User"
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