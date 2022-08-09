import { Collaboration, ConnectedUser, User, UserAlias, UserAuthorization, UserFlag, UserItems, UserType } from "../types/entities/User"
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
    ? user.name!.length > 64 ? user.name!.substring(0, 64) : user.name!
    : (truncateLength ? truncateMiddle(user.id, truncateLength) : user.id)
}

/**
 * Returns true if the user has the rights to moderate the tokens
 */
export function isTokenModerator(user: User): boolean {
  return user.authorizations.includes(UserAuthorization.TOKEN_MODERATION)
}

/**
 * Returns true if the user has the rights to moderate the users
 */
export function isUserModerator(user: User): boolean {
  return user.authorizations.includes(UserAuthorization.USER_MODERATION)
}

/**
 * Returns true if the user is verified
 * (accepts collaboration contracts in which case it checks the verified status
 * of all the users)
 */
export function isEntityVerified(entity: User|Collaboration): boolean {
  if ((entity as Collaboration).collaborators) {
    for (const user of (entity as Collaboration).collaborators) {
      if (!isUserVerified(user)) {
        return false
      }
    }
    return true
  }
  else {
    return isUserVerified(entity)
  }
}

/**
 * Is the user owned by the platform - set through aliases
 */
export function isPlatformOwned(user: User): boolean {
  return !!user.platformOwned
}

export function isDonator(user: User): boolean {
  return !!user.donationAddress
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

export const UserDonationAliases: Record<string, Partial<User>> = {
  "tz1aPHze1U5BEEKrGYt3dvY6aAQEeiWm8jjK": {
    id: "tz1aPHze1U5BEEKrGYt3dvY6aAQEeiWm8jjK",
    name: "Processing Foundation",
    descriptionLight: "The Processing Foundation's mission is to promote software literacy within the visual arts. They are developping p5.js",
    description: "The Processing Foundation's mission is to promote software literacy within the visual arts, and visual literacy within technology-related fields — and to make these fields accessible to diverse communities. They are developping and distributing a group of related software projects, which includes Processing (Java), p5.js (JavaScript), and Processing.py (Python)",
    avatarUri: "ipfs://QmXEjnYw9R7TWpdSeh5Txg2QeTGvstDShY9Neigj3nxFuL",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },
  
  "tz1ZUohCAkGjp7vPjQcC4VWcpgYZR1t3Si5C": {
    id: "tz1ZUohCAkGjp7vPjQcC4VWcpgYZR1t3Si5C",
    name: "Three.js",
    descriptionLight: "Three.js is an easy to use, lightweight, cross-browser, general purpose 3D library.",
    description: "Three.js is an easy to use, lightweight, cross-browser, general purpose 3D library.",
    avatarUri: "ipfs://QmZbR1AVihDaj5WRSnbxwzVmKR5DoKMP9E1CY6fXJABCmZ",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },

  "tz1V1WKxhK9g5UFbhRNUnQMmDnnL2vtBzoZJ": {
    id: "tz1V1WKxhK9g5UFbhRNUnQMmDnnL2vtBzoZJ",
    name: "Hydra",
    descriptionLight: "Hydra is a set of tools for livecoding networked visuals. Inspired by analog modular synthesizers.",
    description: "Hydra is a set of tools for livecoding networked visuals. Inspired by analog modular synthesizers.",
    avatarUri: "ipfs://QmZUUcAw82oTGLVcB5ekGX7kLWMSdY3P9nxj3TtwFRBCNt",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },
}

// a list of User aliases
export const UserAliases: Record<string, Partial<User>> = {
  [process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE!]: {
    id: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE!,
    name: "fxhash marketplace",
    description: "The official fxhash [beta] marketplace",
    authorizations: Object.values(UserAuthorization),
    avatarUri: "ipfs://QmURUAU4YPa6Wwco3JSVrcN7WfCrFBZH7hY51BLrc87WjM",
    platformOwned: true,
  },

  [process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_GENTK_V2!]: {
    id: "The minter of each iteration will get some royalties",
    name: "Minter",
    platformOwned: true,
    preventLink: true,
  },

  ...UserDonationAliases,
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

/**
 * Is the user verified in regards to its flags ?
 */
export function isUserVerified(user: User): boolean {
  return user.flag === UserFlag.VERIFIED
}

/**
 * Is a given user the user provided OR a collaborator in the entity provided
 */
export function isUserOrCollaborator(
  user: User,
  entity: User
): boolean {
  if (entity.type === UserType.COLLAB_CONTRACT_V1) {
    return !!(entity as Collaboration).collaborators.find(
      entity => entity.id === user.id
    )
  }
  else {
    return entity.id === user.id
  }
}