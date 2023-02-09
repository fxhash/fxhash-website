import {
  Collaboration,
  ConnectedUser,
  User,
  UserAlias,
  UserAuthorization,
  UserFlag,
  UserItems,
  UserType,
} from "../types/entities/User"
import { truncateMiddle } from "./strings"

export function userHasName(user: ConnectedUser): boolean {
  return !!(user.name && user.name.length > 0)
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
    ? user.name!.length > 64
      ? user.name!.substring(0, 64)
      : user.name!
    : truncateLength
    ? truncateMiddle(user.id, truncateLength)
    : user.id
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

// true if the user can moderate articles
export function isUserArticleModerator(user: User): boolean {
  return user.authorizations.includes(UserAuthorization.ARTICLE_MODERATION)
}

/**
 * Returns true if the user is verified
 * (accepts collaboration contracts in which case it checks the verified status
 * of all the users)
 */
export function isEntityVerified(entity: User | Collaboration): boolean {
  if ((entity as Collaboration).collaborators) {
    for (const user of (entity as Collaboration).collaborators) {
      if (!isUserVerified(user)) {
        return false
      }
    }
    return true
  } else {
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
    handle: string | undefined | null
    url: string | undefined | null
  } | null
  website?: {
    handle?: string
    url?: string
  }
}

export function processUrl(url: string): { handle?: string; url?: string } {
  if (new RegExp("^(http|https)://").test(url)) {
    return {
      handle: url.replace(/(^\w+:|^)\/\//, ""),
      url,
    }
  } else {
    return {
      handle: url,
      url: `https://${url}`,
    }
  }
}

export function processTzProfile(data: any): TzProfile | null {
  try {
    let pData: TzProfile = {}
    for (const verif of data) {
      const verifData = JSON.parse(verif[1])
      if (verifData?.type?.includes("VerifiableCredential")) {
        // is it twitter ?
        if (verifData?.type?.includes("TwitterVerification")) {
          pData.twitter = {
            handle: verifData?.evidence?.handle,
            url: verifData?.credentialSubject?.sameAs,
          }
        }
        // is it website ?
        if (verifData?.type?.includes("BasicProfile")) {
          pData.website =
            (verifData?.credentialSubject?.website &&
              processUrl(verifData.credentialSubject.website)) ||
            undefined
        }
      }
    }
    return pData.twitter || pData.website ? pData : null
  } catch {
    return null
  }
}

export const UserDonationAliases: Record<string, Partial<User>> = {
  tz2JuyvKDbsBvoFfaww7rcUb3qDpvTcZngeD: {
    id: "tz2JuyvKDbsBvoFfaww7rcUb3qDpvTcZngeD",
    name: "Girls Who Code",
    descriptionLight:
      "Girls Who Code is on a mission to close the gender gap in technology and to change the image of what a programmer looks like and does.",
    description:
      "Girls Who Code is on a mission to close the gender gap in technology and to change the image of what a programmer looks like and does.\n" +
      "With the support of our community, we've been able to reach 500,000 students to date! Your gift helps keep our 3rd–12th grade Clubs running throughout the year and helps fund new pilot programs for our 115,000 college-age alumni.",
    avatarUri: "ipfs://QmUpfKohCAM8A54ero7mUu67UoNyuLeYNoRAMWeh9MmmjD",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },

  tz1WnJ5Qk4buxdp6taz2hfWGRLBag7SxtKnV: {
    id: "tz1WnJ5Qk4buxdp6taz2hfWGRLBag7SxtKnV",
    name: "Cure Parkinson's",
    descriptionLight:
      "Tezos donation address for Cure Parkinson's, a charity which funds research that slows, stops or reverses Parkinson’s",
    description:
      "Tezos donation address for Cure Parkinson's, a charity which funds research that slows, stops or reverses Parkinson’s",
    avatarUri: "ipfs://QmWYEXAF2QAqMqraArxucTg2Rc2batNwrm9dDzdTUC2vs8",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },

  tz1aPHze1U5BEEKrGYt3dvY6aAQEeiWm8jjK: {
    id: "tz1aPHze1U5BEEKrGYt3dvY6aAQEeiWm8jjK",
    name: "Processing Foundation",
    descriptionLight:
      "The Processing Foundation's mission is to promote software literacy within the visual arts. They are developping p5.js",
    description:
      "The Processing Foundation's mission is to promote software literacy within the visual arts, and visual literacy within technology-related fields — and to make these fields accessible to diverse communities. They are developping and distributing a group of related software projects, which includes Processing (Java), p5.js (JavaScript), and Processing.py (Python)",
    avatarUri: "ipfs://QmXEjnYw9R7TWpdSeh5Txg2QeTGvstDShY9Neigj3nxFuL",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },

  tz1ZUohCAkGjp7vPjQcC4VWcpgYZR1t3Si5C: {
    id: "tz1ZUohCAkGjp7vPjQcC4VWcpgYZR1t3Si5C",
    name: "Three.js",
    descriptionLight:
      "Three.js is an easy to use, lightweight, cross-browser, general purpose 3D library.",
    description:
      "Three.js is an easy to use, lightweight, cross-browser, general purpose 3D library.",
    avatarUri: "ipfs://QmZbR1AVihDaj5WRSnbxwzVmKR5DoKMP9E1CY6fXJABCmZ",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },

  tz1V1WKxhK9g5UFbhRNUnQMmDnnL2vtBzoZJ: {
    id: "tz1V1WKxhK9g5UFbhRNUnQMmDnnL2vtBzoZJ",
    name: "Hydra",
    descriptionLight:
      "Hydra is a set of tools for livecoding networked visuals. Inspired by analog modular synthesizers.",
    description:
      "Hydra is a set of tools for livecoding networked visuals. Inspired by analog modular synthesizers.",
    avatarUri: "ipfs://QmZUUcAw82oTGLVcB5ekGX7kLWMSdY3P9nxj3TtwFRBCNt",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },

  KT1Jpf2TAcZS7QfBraQMBeCxjFhH6kAdDL4z: {
    id: "KT1Jpf2TAcZS7QfBraQMBeCxjFhH6kAdDL4z",
    name: "Savepakistan",
    descriptionLight:
      "Savepakistan - Cross-platform Tezos Flood Relief Fundraiser.",
    description: "Tezos Flood Relief Fundraiser for Pakistan.",
    avatarUri: "ipfs://Qma8bVd3213ZaWUFkRdxCwnCq52fbtzgykDUnniQ36gEuh",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },

  KT1KYfj97fpdomqyKsZSBdSVvh9afh93b4Ge: {
    id: "KT1KYfj97fpdomqyKsZSBdSVvh9afh93b4Ge",
    name: "Tezos for Iran",
    descriptionLight:
      "A charity fundraiser in solidarity with the protests and to raise awareness for womens' rights in Iran.",
    description:
      "A charity fundraiser in solidarity with the protests and to raise awareness for womens' rights in Iran.",
    avatarUri: "ipfs://QmWyaMu6H6WaGgTjM52pbwdUVj5AE3FLQT7f17hjLpmqyj",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },

  tz2Lpw9a4Wguwx9EonMvGC6MxznhDnKNNqMt: {
    id: "tz2Lpw9a4Wguwx9EonMvGC6MxznhDnKNNqMt",
    name: "OutRight International",
    descriptionLight:
      "Outright International is dedicated to working with partners around the globe to strengthen the capacity of the LGBTIQ human rights movement, document and amplify human rights violations against LGBTIQ people and advocate for inclusion and equality.",
    description:
      "Outright International is dedicated to working with partners around the globe to strengthen the capacity of the LGBTIQ human rights movement, document and amplify human rights violations against LGBTIQ people and advocate for inclusion and equality.\n" +
      "Founded in 1990, with staff in over a dozen countries, Outright works with the United Nations, regional human rights monitoring bodies and civil society partners. Outright holds consultative status at the United Nations where it serves as the secretariat of the UN LGBTI Core Group.",
    avatarUri: "ipfs://QmZiG2vtfpABdA1kjthBzdBcnU9wami4BM3paawctJMgCz",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },

  tz2MNEfWa9cE7X8Q4RG83RprvACSxkPLh5Hm: {
    id: "tz2MNEfWa9cE7X8Q4RG83RprvACSxkPLh5Hm",
    name: "Committee to Protect Journalists",
    descriptionLight:
      "The Committee to Protect Journalists is an independent, nonprofit organization that promotes press freedom worldwide. CPJ defends the right of journalists to report the news safely and without fear of reprisal.",
    description:
      "The Committee to Protect Journalists is an independent, nonprofit organization that promotes press freedom worldwide. CPJ defends the right of journalists to report the news safely and without fear of reprisal.\n" +
      "CPJ is made up of about 40 experts around the world, with headquarters in New York City. When press freedom violations occur, CPJ mobilizes a network of correspondents who report and take action on behalf of those targeted.",
    avatarUri: "ipfs://QmRe9XkpqEdeMQrPv2Zg55uy8hoz2Kr8AKsEWMaFZApVFc",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },

  tz2D6cMQdQCTyKs8z2LRRBLbv9MAzVd837G7: {
    id: "tz2D6cMQdQCTyKs8z2LRRBLbv9MAzVd837G7",
    name: "Environmental Conservation Cause Fund",
    descriptionLight:
      "Help nonprofits that tackle the effects of climate change and air pollution, or support the development of renewable energy, sustainability, and biodiversity. ",
    description:
      "Help nonprofits that tackle the effects of climate change and air pollution, or support the development of renewable energy, sustainability, and biodiversity. Organizations in this fund create and strengthen protected areas, develop conservation solutions through science and technology, and provide training and tools to live sustainably.",
    avatarUri: "ipfs://QmT2CRkz9LnYtEwH8CHJoBep3b3kYtgZWtGRowrDHkhV3P",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },

  tz2CgoSVo38aubxEWY18uu9r3SUtpLckUTQq: {
    id: "tz2CgoSVo38aubxEWY18uu9r3SUtpLckUTQq",
    name: "High Impact Cause Fund",
    descriptionLight:
      "The High Impact Fund supports non-profits that have been selected by experts based on their cost-effectiveness and the evidence that their programs make a real difference. By giving to the High Impact Fund, you can help a portfolio of nonprofits that provide access to critical medical care, promote economic empowerment, and fight climate change, all with a single donation.",
    description:
      "The High Impact Fund supports non-profits that have been selected by experts based on their cost-effectiveness and the evidence that their programs make a real difference. By giving to the High Impact Fund, you can help a portfolio of nonprofits that provide access to critical medical care, promote economic empowerment, and fight climate change, all with a single donation. The Fund’s grantee’s are selected by The Life You Can Save, a non-profit whose mission is to help improve, or even save, the lives of the world’s poorest people.",
    avatarUri: "ipfs://QmPP3hsTDrHtJjw2BxQxJRZKfmYgGGGD3jUXVVeaNYeurG",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },

  tz2SBTaKfzGNas6gNjqXfHwTFDJS94mVSaSb: {
    id: "tz2SBTaKfzGNas6gNjqXfHwTFDJS94mVSaSb",
    name: "Seva Foundation",
    descriptionLight:
      "Seva is a global nonprofit eye care organization that works with local communities around the world to develop self-sustaining programs that preserve and restore sight.",
    description:
      "Seva is a global nonprofit eye care organization that works with local communities around the world to develop self-sustaining programs that preserve and restore sight." +
      "Most eye care treatments change lives right away. A pair of glasses brings the world into focus. A 15-minute cataract surgery restores sight and independence. Medication for eye infections prevents decades of blindness and suffering. High-quality eye care creates an immediate and lasting impact.",
    avatarUri: "ipfs://QmPYDeiGRbkpC4cEwRdhZJdyTqgCaY5pTKTU1DJ1j79eB6",
    donationAddress: true,
    flag: UserFlag.VERIFIED,
  },
}

// a list of User aliases
export const UserAliases: Record<string, Partial<User>> = {
  [process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE_V1!]: {
    id: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE_V1!,
    name: "fxhash marketplace v1.0",
    description: "The official fxhash [beta] marketplace, first version.",
    authorizations: Object.values(UserAuthorization),
    avatarUri: "ipfs://QmURUAU4YPa6Wwco3JSVrcN7WfCrFBZH7hY51BLrc87WjM",
    platformOwned: true,
    preventLink: true,
  },

  [process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE_V2!]: {
    id: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE_V2!,
    name: "fxhash marketplace 2.0",
    description: "The official marketplace 2.0 of fxhash.",
    authorizations: Object.values(UserAuthorization),
    avatarUri: "ipfs://QmURUAU4YPa6Wwco3JSVrcN7WfCrFBZH7hY51BLrc87WjM",
    platformOwned: true,
    preventLink: true,
  },

  [process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE_V3!]: {
    id: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE_V3!,
    name: "fxhash marketplace 3.0",
    description: "The official marketplace 3.0 of fxhash.",
    authorizations: Object.values(UserAuthorization),
    avatarUri: "ipfs://QmURUAU4YPa6Wwco3JSVrcN7WfCrFBZH7hY51BLrc87WjM",
    platformOwned: true,
    preventLink: true,
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
      ...UserAliases[user.id],
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
export function isUserOrCollaborator(user: User, entity: User): boolean {
  if (entity.type === UserType.COLLAB_CONTRACT_V1) {
    return !!(entity as Collaboration).collaborators.find(
      (entity) => entity.id === user.id
    )
  } else {
    return entity.id === user.id
  }
}
